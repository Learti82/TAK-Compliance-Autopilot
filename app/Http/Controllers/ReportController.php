<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\PayrollItem;
use App\Models\PayrollRun;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function payroll(Request $request): Response
    {
        $companyId = auth()->user()->company_id;
        $year = $request->integer('year', now()->year);

        $runs = PayrollRun::where('company_id', $companyId)
            ->where('year', $year)
            ->orderBy('month')
            ->get();

        $monthlyTotals = $runs->map(fn($r) => [
            'month' => $r->month,
            'period' => $r->period_label,
            'status' => $r->status,
            'employees' => $r->employee_count,
            'gross' => (float) $r->total_gross,
            'net' => (float) $r->total_net,
            'pit' => (float) $r->total_pit,
            'employee_pension' => (float) $r->total_employee_pension,
            'employer_pension' => (float) $r->total_employer_pension,
            'employer_cost' => (float) $r->total_employer_cost,
        ]);

        $annualTotals = [
            'gross' => $runs->sum('total_gross'),
            'net' => $runs->sum('total_net'),
            'pit' => $runs->sum('total_pit'),
            'employee_pension' => $runs->sum('total_employee_pension'),
            'employer_pension' => $runs->sum('total_employer_pension'),
            'employer_cost' => $runs->sum('total_employer_cost'),
        ];

        return Inertia::render('Reports/Payroll', [
            'year' => $year,
            'monthly_totals' => $monthlyTotals,
            'annual_totals' => $annualTotals,
            'available_years' => PayrollRun::where('company_id', $companyId)
                ->distinct()
                ->pluck('year')
                ->sortDesc()
                ->values(),
        ]);
    }

    public function employees(Request $request): Response
    {
        $companyId = auth()->user()->company_id;

        $employees = Employee::where('company_id', $companyId)
            ->withCount(['payrollItems'])
            ->orderBy('last_name')
            ->get();

        $year = $request->integer('year', now()->year);

        $employeeSummaries = Employee::where('company_id', $companyId)
            ->where('status', 'active')
            ->get()
            ->map(function ($employee) use ($year, $companyId) {
                $items = PayrollItem::where('employee_id', $employee->id)
                    ->whereHas('payrollRun', fn($q) => $q->where('year', $year)->where('company_id', $companyId))
                    ->get();

                return [
                    'id' => $employee->id,
                    'name' => $employee->full_name,
                    'position' => $employee->position,
                    'gross_salary' => (float) $employee->gross_salary,
                    'annual_gross' => (float) $items->sum('gross_salary'),
                    'annual_pit' => (float) $items->sum('pit'),
                    'annual_pension' => (float) $items->sum('employee_pension'),
                    'months_paid' => $items->count(),
                ];
            });

        return Inertia::render('Reports/Employees', [
            'employees' => $employeeSummaries,
            'year' => $year,
            'available_years' => PayrollRun::where('company_id', $companyId)
                ->distinct()->pluck('year')->sortDesc()->values(),
        ]);
    }
}
