<?php

namespace Database\Seeders;

use App\Models\TaxBracket;
use Illuminate\Database\Seeder;

class TaxBracketSeeder extends Seeder
{
    public function run(): void
    {
        $year = 2025;

        // Kosovo PIT brackets (monthly, after €80 exemption)
        // 4% on first €250 of taxable income after exemption
        // 10% on amounts above €250
        $pitBrackets = [
            ['type' => 'pit', 'min_amount' => 0, 'max_amount' => 250.00, 'rate' => 0.04, 'tax_year' => $year, 'is_active' => true],
            ['type' => 'pit', 'min_amount' => 250.00, 'max_amount' => null, 'rate' => 0.10, 'tax_year' => $year, 'is_active' => true],
        ];

        // Pension (5% flat rate on gross salary, both employee and employer)
        $pensionBrackets = [
            ['type' => 'pension_employee', 'min_amount' => 0, 'max_amount' => null, 'rate' => 0.05, 'tax_year' => $year, 'is_active' => true],
            ['type' => 'pension_employer', 'min_amount' => 0, 'max_amount' => null, 'rate' => 0.05, 'tax_year' => $year, 'is_active' => true],
        ];

        foreach ([...$pitBrackets, ...$pensionBrackets] as $bracket) {
            TaxBracket::firstOrCreate(
                [
                    'type' => $bracket['type'],
                    'min_amount' => $bracket['min_amount'],
                    'tax_year' => $bracket['tax_year'],
                ],
                $bracket
            );
        }
    }
}
