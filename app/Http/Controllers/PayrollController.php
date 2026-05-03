<?php

namespace App\Http\Controllers;

use App\Exports\PayrollExport;
use App\Models\ComplianceDeadline;
use App\Models\PayrollRun;
use App\Services\AuditService;
use App\Services\ComplianceService;
use App\Services\PayrollEngine;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class PayrollController extends Controller
{
    public function __construct(
        private PayrollEngine $engine,
        private AuditService $audit,
        private ComplianceService $compliance
    ) {}

    public function index(Request $request): Response
    {
        $companyId = auth()->user()->company_id;

        $runs = PayrollRun::where('company_id', $companyId)
            ->when($request->year, fn($q) => $q->where('year', $request->year))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Payroll/Index', [
            'runs' => $runs,
            'filters' => $request->only(['year', 'status']),
        ]);
    }

    public function create(): Response
    {
        $companyId = auth()->user()->company_id;
        $now = now();

        // Find months that don't have a payroll run yet
        $existing = PayrollRun::where('company_id', $companyId)
            ->pluck('month', 'year')
            ->groupBy(fn($month, $year) => $year)
            ->toArray();

        return Inertia::render('Payroll/Create', [
            'suggested_year' => $now->year,
            'suggested_month' => $now->month,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'year' => ['required', 'integer', 'min:2020', 'max:2100'],
            'month' => ['required', 'integer', 'min:1', 'max:12'],
            'notes' => ['nullable', 'string'],
        ]);

        $companyId = auth()->user()->company_id;

        $existing = PayrollRun::where('company_id', $companyId)
            ->where('year', $data['year'])
            ->where('month', $data['month'])
            ->exists();

        if ($existing) {
            return back()->withErrors(['month' => 'Tashmë ekziston një listë pagash për këtë periudhë.']);
        }

        $submissionDeadline = Carbon::create($data['year'], $data['month'], 1)
            ->addMonth()
            ->setDay(15);

        $run = PayrollRun::create([
            'company_id' => $companyId,
            'created_by' => auth()->id(),
            'year' => $data['year'],
            'month' => $data['month'],
            'status' => 'draft',
            'submission_deadline' => $submissionDeadline,
            'notes' => $data['notes'] ?? null,
        ]);

        // Generate payroll items
        $this->engine->generatePayrollRun($run);

        // Ensure compliance deadline exists
        $this->compliance->createMonthlyPayrollDeadline(
            auth()->user()->company,
            $data['year'],
            $data['month']
        );

        $this->audit->logCreated('payroll_run', $run->id, $run->period_label);

        return redirect()->route('payroll.show', $run)
            ->with('success', "Lista e pagave për {$run->period_label} u krijua.");
    }

    public function show(PayrollRun $payrollRun): Response
    {
        $this->authorizeCompany($payrollRun->company_id);

        $payrollRun->load([
            'items.employee:id,first_name,last_name,position,department,contract_type',
            'createdBy:id,name',
            'approvedBy:id,name',
        ]);

        return Inertia::render('Payroll/Show', [
            'run' => $payrollRun,
            'is_overdue' => $payrollRun->isOverdue(),
        ]);
    }

    public function approve(PayrollRun $payrollRun): RedirectResponse
    {
        $this->authorizeCompany($payrollRun->company_id);

        if (!$payrollRun->canBeApproved()) {
            return back()->withErrors(['status' => 'Lista e pagave nuk mund të aprovohet në këtë status.']);
        }

        $payrollRun->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        $this->audit->logAction('approved', 'payroll_run', $payrollRun->id, $payrollRun->period_label);

        return back()->with('success', "Lista e pagave u aprovua.");
    }

    public function submit(PayrollRun $payrollRun): RedirectResponse
    {
        $this->authorizeCompany($payrollRun->company_id);

        if (!$payrollRun->canBeSubmitted()) {
            return back()->withErrors(['status' => 'Lista e pagave duhet të aprovohet fillimisht.']);
        }

        $payrollRun->update([
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        // Mark compliance deadline as completed
        ComplianceDeadline::where('company_id', $payrollRun->company_id)
            ->where('type', 'monthly_payroll')
            ->where('reference_year', $payrollRun->year)
            ->where('reference_month', $payrollRun->month)
            ->update([
                'status' => 'completed',
                'completed_at' => now(),
                'completed_by' => auth()->id(),
            ]);

        $this->audit->logAction('submitted', 'payroll_run', $payrollRun->id, $payrollRun->period_label);

        return back()->with('success', "Lista e pagave u shënua si e dorëzuar.");
    }

    public function regenerate(PayrollRun $payrollRun): RedirectResponse
    {
        $this->authorizeCompany($payrollRun->company_id);

        if ($payrollRun->status !== 'draft') {
            return back()->withErrors(['status' => 'Mund të rigjeneroni vetëm listën Draft.']);
        }

        $this->engine->generatePayrollRun($payrollRun);
        $this->audit->logAction('regenerated', 'payroll_run', $payrollRun->id, $payrollRun->period_label);

        return back()->with('success', 'Lista e pagave u rigjenerua.');
    }

    public function export(PayrollRun $payrollRun): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $this->authorizeCompany($payrollRun->company_id);

        $this->audit->logAction('exported', 'payroll_run', $payrollRun->id, $payrollRun->period_label);

        return Excel::download(
            new PayrollExport($payrollRun),
            "pagesa-{$payrollRun->year}-{$payrollRun->month}.xlsx"
        );
    }

    public function takFile(PayrollRun $payrollRun): \Illuminate\Http\Response
    {
        $this->authorizeCompany($payrollRun->company_id);

        $payrollRun->load(['items.employee', 'company']);

        $this->audit->logAction('tak_export', 'payroll_run', $payrollRun->id, $payrollRun->period_label);

        // TAK CSV format placeholder (structure per Kosovo TAK requirements)
        $lines = ["NR;EMRI;MBIEMRI;NR_PERSONAL;PAGA_BRUTO;PENSIONI_P;PENSIONI_P_G;TE_ARDHURA_TATIMORE;TM;PAGA_NETO"];
        foreach ($payrollRun->items as $i => $item) {
            $e = $item->employee;
            $lines[] = implode(';', [
                $i + 1,
                $e->first_name,
                $e->last_name,
                $e->personal_number ?? '',
                number_format($item->gross_salary, 2, '.', ''),
                number_format($item->employee_pension, 2, '.', ''),
                number_format($item->employer_pension, 2, '.', ''),
                number_format($item->taxable_income, 2, '.', ''),
                number_format($item->pit, 2, '.', ''),
                number_format($item->net_salary, 2, '.', ''),
            ]);
        }

        $content = implode("\n", $lines);
        $filename = "tak-{$payrollRun->company->fiscal_number}-{$payrollRun->year}-{$payrollRun->month}.csv";

        return response($content, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    private function authorizeCompany(int $companyId): void
    {
        if (!auth()->user()->isSuperAdmin() && auth()->user()->company_id !== $companyId) {
            abort(403);
        }
    }
}
