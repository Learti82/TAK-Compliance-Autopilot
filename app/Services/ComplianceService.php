<?php

namespace App\Services;

use App\Models\Company;
use App\Models\ComplianceDeadline;
use App\Models\Employee;
use Carbon\Carbon;

class ComplianceService
{
    /**
     * Generate monthly payroll submission deadline (15th of following month).
     */
    public function createMonthlyPayrollDeadline(Company $company, int $year, int $month): ComplianceDeadline
    {
        $dueDate = Carbon::create($year, $month, 1)->addMonth()->setDay(15);

        $monthName = $this->monthName($month);

        return ComplianceDeadline::firstOrCreate(
            [
                'company_id' => $company->id,
                'type' => 'monthly_payroll',
                'reference_year' => $year,
                'reference_month' => $month,
            ],
            [
                'title' => "Dorëzim i pagës – {$monthName} {$year}",
                'description' => "Dorëzimi i listës pagave për {$monthName} {$year} tek TAK (afati: 15 i muajit pasues).",
                'due_date' => $dueDate,
                'status' => 'pending',
            ]
        );
    }

    /**
     * Generate annual PIT declaration deadline (March 31).
     */
    public function createAnnualPitDeadline(Company $company, int $year): ComplianceDeadline
    {
        $dueDate = Carbon::create($year + 1, 3, 31);

        return ComplianceDeadline::firstOrCreate(
            [
                'company_id' => $company->id,
                'type' => 'annual_pit',
                'reference_year' => $year,
            ],
            [
                'title' => "Deklaratë PIT vjetore – {$year}",
                'description' => "Deklarata vjetore e tatimit mbi të ardhurat personale (PIT) për vitin {$year}.",
                'due_date' => $dueDate,
                'status' => 'pending',
            ]
        );
    }

    /**
     * Create registration deadline for a new employee (must be registered before start date).
     */
    public function createEmployeeRegistrationDeadline(Employee $employee): ComplianceDeadline
    {
        return ComplianceDeadline::firstOrCreate(
            [
                'company_id' => $employee->company_id,
                'employee_id' => $employee->id,
                'type' => 'employee_registration',
            ],
            [
                'title' => "Regjistrim punëtori: {$employee->full_name}",
                'description' => "Punëtori {$employee->full_name} duhet të regjistrohet tek TAK para datës {$employee->start_date->format('d/m/Y')}.",
                'due_date' => $employee->start_date->subDay(),
                'status' => 'pending',
            ]
        );
    }

    /**
     * Update overdue statuses for a company's deadlines.
     */
    public function updateOverdueStatuses(Company $company): int
    {
        return ComplianceDeadline::where('company_id', $company->id)
            ->where('status', 'pending')
            ->where('due_date', '<', now()->startOfDay())
            ->update(['status' => 'overdue']);
    }

    /**
     * Get compliance score (0-100) for a company.
     */
    public function getComplianceScore(Company $company): array
    {
        $this->updateOverdueStatuses($company);

        $total = ComplianceDeadline::where('company_id', $company->id)
            ->whereIn('status', ['pending', 'completed', 'overdue'])
            ->count();

        if ($total === 0) {
            return ['score' => 100, 'level' => 'green', 'label' => 'Mirë'];
        }

        $overdue = ComplianceDeadline::where('company_id', $company->id)
            ->where('status', 'overdue')
            ->count();

        $dueSoon = ComplianceDeadline::where('company_id', $company->id)
            ->where('status', 'pending')
            ->whereBetween('due_date', [now(), now()->addDays(7)])
            ->count();

        $score = max(0, 100 - ($overdue * 25) - ($dueSoon * 5));

        if ($overdue > 0) {
            return ['score' => $score, 'level' => 'red', 'label' => 'Kritike'];
        }
        if ($dueSoon > 0) {
            return ['score' => $score, 'level' => 'yellow', 'label' => 'Kujdes'];
        }
        return ['score' => 100, 'level' => 'green', 'label' => 'Mirë'];
    }

    /**
     * Seed upcoming deadlines for the current and next 12 months.
     */
    public function seedDeadlines(Company $company): void
    {
        $now = now();

        // Monthly payroll deadlines for last 6 months + next 6 months
        for ($i = -6; $i <= 6; $i++) {
            $date = $now->copy()->addMonths($i);
            $this->createMonthlyPayrollDeadline($company, $date->year, $date->month);
        }

        // Annual PIT for last year and current year
        $this->createAnnualPitDeadline($company, $now->year - 1);
        $this->createAnnualPitDeadline($company, $now->year);
    }

    private function monthName(int $month): string
    {
        $months = [
            1 => 'Janar', 2 => 'Shkurt', 3 => 'Mars', 4 => 'Prill',
            5 => 'Maj', 6 => 'Qershor', 7 => 'Korrik', 8 => 'Gusht',
            9 => 'Shtator', 10 => 'Tetor', 11 => 'Nëntor', 12 => 'Dhjetor',
        ];
        return $months[$month] ?? (string) $month;
    }
}
