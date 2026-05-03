<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\PayrollItem;
use App\Models\PayrollRun;
use App\Models\TaxBracket;
use Illuminate\Support\Collection;

class PayrollEngine
{
    private const PENSION_RATE = 0.05; // 5% both employee and employer
    private const ANNUAL_EXEMPT = 960.00; // Annual PIT exemption (Kosovo 2024: €960/year = €80/month)

    public function calculateForEmployee(Employee $employee, int $year): array
    {
        $grossSalary = (float) $employee->gross_salary;
        return $this->calculate($grossSalary, $year);
    }

    /**
     * Core Kosovo payroll calculation.
     *
     * Kosovo PIT (2024):
     *  - Monthly taxable income (after pension deduction) up to €80/mo is exempt
     *  - 4% on taxable income €0 – €250/mo (after exemption)
     *  - 10% on taxable income above €250/mo
     *
     * Pension: 5% employee + 5% employer (both on gross)
     */
    public function calculate(float $grossSalary, int $year): array
    {
        $employeePension = round($grossSalary * self::PENSION_RATE, 2);
        $employerPension = round($grossSalary * self::PENSION_RATE, 2);

        $taxableIncome = $grossSalary - $employeePension;

        $pit = $this->calculatePit($taxableIncome, $year);

        $netSalary = round($taxableIncome - $pit, 2);
        $employerCost = round($grossSalary + $employerPension, 2);

        return [
            'gross_salary' => round($grossSalary, 2),
            'employee_pension' => $employeePension,
            'employer_pension' => $employerPension,
            'taxable_income' => round($taxableIncome, 2),
            'pit' => $pit,
            'net_salary' => $netSalary,
            'employer_cost' => $employerCost,
        ];
    }

    public function calculatePit(float $taxableIncome, int $year): float
    {
        // Try database brackets first, fall back to hardcoded Kosovo rules
        $brackets = TaxBracket::getActivePitBrackets($year);

        if ($brackets->isEmpty()) {
            return $this->calculatePitKosovo2024($taxableIncome);
        }

        return $this->applyBrackets($taxableIncome, $brackets);
    }

    /**
     * Kosovo PIT rules (2024 / monthly):
     * - Monthly exemption: €80
     * - 4% on the first €250 of taxable monthly income (after exemption)
     * - 10% on amounts above €250
     */
    private function calculatePitKosovo2024(float $taxableIncome): float
    {
        $monthlyExempt = 80.00;
        $afterExemption = max(0, $taxableIncome - $monthlyExempt);

        if ($afterExemption <= 0) {
            return 0.0;
        }

        $pit = 0.0;
        $bracket1Limit = 250.00;
        $bracket1Rate = 0.04;
        $bracket2Rate = 0.10;

        if ($afterExemption <= $bracket1Limit) {
            $pit = $afterExemption * $bracket1Rate;
        } else {
            $pit = ($bracket1Limit * $bracket1Rate) + (($afterExemption - $bracket1Limit) * $bracket2Rate);
        }

        return round($pit, 2);
    }

    private function applyBrackets(float $taxableIncome, Collection $brackets): float
    {
        $monthlyExempt = 80.00;
        $afterExemption = max(0, $taxableIncome - $monthlyExempt);
        $pit = 0.0;
        $remaining = $afterExemption;

        foreach ($brackets as $bracket) {
            if ($remaining <= 0) {
                break;
            }
            $min = (float) $bracket->min_amount;
            $max = $bracket->max_amount ? (float) $bracket->max_amount : PHP_FLOAT_MAX;
            $bracketWidth = $max - $min;
            $inBracket = min($remaining, $bracketWidth);
            $pit += $inBracket * (float) $bracket->rate;
            $remaining -= $inBracket;
        }

        return round($pit, 2);
    }

    public function generatePayrollRun(PayrollRun $run): PayrollRun
    {
        $company = $run->company()->with('activeEmployees')->first();
        $employees = $company->activeEmployees;
        $year = $run->year;

        $items = [];
        $totals = [
            'total_gross' => 0,
            'total_net' => 0,
            'total_employee_pension' => 0,
            'total_employer_pension' => 0,
            'total_pit' => 0,
            'total_employer_cost' => 0,
        ];

        foreach ($employees as $employee) {
            $calc = $this->calculateForEmployee($employee, $year);

            $item = [
                'payroll_run_id' => $run->id,
                'employee_id' => $employee->id,
                'company_id' => $run->company_id,
                'gross_salary' => $calc['gross_salary'],
                'employee_pension' => $calc['employee_pension'],
                'employer_pension' => $calc['employer_pension'],
                'taxable_income' => $calc['taxable_income'],
                'pit' => $calc['pit'],
                'net_salary' => $calc['net_salary'],
                'employer_cost' => $calc['employer_cost'],
                'other_deductions' => 0,
                'other_additions' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            $items[] = $item;

            $totals['total_gross'] += $calc['gross_salary'];
            $totals['total_net'] += $calc['net_salary'];
            $totals['total_employee_pension'] += $calc['employee_pension'];
            $totals['total_employer_pension'] += $calc['employer_pension'];
            $totals['total_pit'] += $calc['pit'];
            $totals['total_employer_cost'] += $calc['employer_cost'];
        }

        // Delete old items and re-insert (idempotent)
        PayrollItem::where('payroll_run_id', $run->id)->delete();
        PayrollItem::insert($items);

        $run->update([
            ...$totals,
            'employee_count' => count($items),
        ]);

        return $run->fresh(['items.employee']);
    }
}
