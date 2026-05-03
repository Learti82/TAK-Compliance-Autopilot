<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\ComplianceDeadline;
use App\Models\Employee;
use App\Models\PayrollRun;
use App\Services\ComplianceService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private ComplianceService $compliance) {}

    public function index(): Response
    {
        $user = auth()->user();
        $companyId = $user->company_id;

        if (!$companyId) {
            return Inertia::render('Dashboard/SuperAdmin', $this->superAdminData());
        }

        $company = $user->company;
        $this->compliance->updateOverdueStatuses($company);

        $now = now();

        $upcomingDeadlines = ComplianceDeadline::where('company_id', $companyId)
            ->whereIn('status', ['pending'])
            ->where('due_date', '>=', $now)
            ->orderBy('due_date')
            ->limit(10)
            ->get();

        $overdueDeadlines = ComplianceDeadline::where('company_id', $companyId)
            ->where('status', 'overdue')
            ->orderBy('due_date')
            ->get();

        $recentPayrolls = PayrollRun::where('company_id', $companyId)
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->limit(6)
            ->get();

        $employeeStats = [
            'total' => Employee::where('company_id', $companyId)->where('status', 'active')->count(),
            'unregistered' => Employee::where('company_id', $companyId)
                ->where('status', 'active')
                ->whereNull('tak_registered_at')
                ->count(),
        ];

        $currentMonthPayroll = PayrollRun::where('company_id', $companyId)
            ->where('year', $now->year)
            ->where('month', $now->month)
            ->first();

        $recentActivity = AuditLog::where('company_id', $companyId)
            ->with('user:id,name')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        $complianceScore = $this->compliance->getComplianceScore($company);

        // Monthly payroll totals for chart (last 6 months)
        $payrollChart = PayrollRun::where('company_id', $companyId)
            ->where(function ($q) use ($now) {
                $q->where('year', $now->year)
                    ->orWhere('year', $now->year - 1);
            })
            ->orderBy('year')
            ->orderBy('month')
            ->limit(12)
            ->get(['year', 'month', 'total_gross', 'total_net', 'total_pit', 'status'])
            ->map(fn($r) => [
                'period' => $r->period_label,
                'gross' => (float) $r->total_gross,
                'net' => (float) $r->total_net,
                'pit' => (float) $r->total_pit,
                'status' => $r->status,
            ]);

        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'employees' => $employeeStats,
                'compliance_score' => $complianceScore,
                'overdue_count' => $overdueDeadlines->count(),
                'upcoming_count' => $upcomingDeadlines->count(),
                'current_month_payroll' => $currentMonthPayroll ? [
                    'id' => $currentMonthPayroll->id,
                    'status' => $currentMonthPayroll->status,
                    'total_gross' => (float) $currentMonthPayroll->total_gross,
                    'total_net' => (float) $currentMonthPayroll->total_net,
                    'employee_count' => $currentMonthPayroll->employee_count,
                ] : null,
            ],
            'upcoming_deadlines' => $upcomingDeadlines,
            'overdue_deadlines' => $overdueDeadlines,
            'recent_payrolls' => $recentPayrolls,
            'recent_activity' => $recentActivity,
            'payroll_chart' => $payrollChart,
        ]);
    }

    private function superAdminData(): array
    {
        return [
            'stats' => [
                'total_companies' => \App\Models\Company::count(),
                'total_users' => \App\Models\User::count(),
                'total_employees' => Employee::count(),
                'active_subscriptions' => \App\Models\Subscription::where('status', 'active')->count(),
            ],
        ];
    }
}
