<?php

namespace App\Http\Controllers;

use App\Models\ComplianceDeadline;
use App\Services\ComplianceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ComplianceController extends Controller
{
    public function __construct(private ComplianceService $compliance) {}

    public function index(Request $request): Response
    {
        $companyId = auth()->user()->company_id;
        $company = auth()->user()->company;

        $this->compliance->updateOverdueStatuses($company);

        $query = ComplianceDeadline::where('company_id', $companyId)
            ->with('employee:id,first_name,last_name')
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->orderBy('due_date');

        $deadlines = $query->paginate(20)->withQueryString();

        $score = $this->compliance->getComplianceScore($company);

        $summary = [
            'total' => ComplianceDeadline::where('company_id', $companyId)->count(),
            'overdue' => ComplianceDeadline::where('company_id', $companyId)->where('status', 'overdue')->count(),
            'due_soon' => ComplianceDeadline::where('company_id', $companyId)
                ->where('status', 'pending')
                ->whereBetween('due_date', [now(), now()->addDays(7)])
                ->count(),
            'completed' => ComplianceDeadline::where('company_id', $companyId)->where('status', 'completed')->count(),
        ];

        return Inertia::render('Compliance/Index', [
            'deadlines' => $deadlines,
            'filters' => $request->only(['type', 'status']),
            'score' => $score,
            'summary' => $summary,
        ]);
    }

    public function markComplete(ComplianceDeadline $deadline): RedirectResponse
    {
        $this->authorizeCompany($deadline->company_id);

        $deadline->update([
            'status' => 'completed',
            'completed_at' => now(),
            'completed_by' => auth()->id(),
        ]);

        return back()->with('success', 'Detyrimi u shënua si i kompletuar.');
    }

    public function markWaived(ComplianceDeadline $deadline): RedirectResponse
    {
        $this->authorizeCompany($deadline->company_id);
        $deadline->update(['status' => 'waived']);
        return back()->with('success', 'Detyrimi u shënua si i hequr.');
    }

    private function authorizeCompany(int $companyId): void
    {
        if (!auth()->user()->isSuperAdmin() && auth()->user()->company_id !== $companyId) {
            abort(403);
        }
    }
}
