<?php

namespace App\Exports;

use App\Models\PayrollRun;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PayrollExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithTitle, WithStyles
{
    public function __construct(private PayrollRun $run)
    {
        $this->run->load('items.employee');
    }

    public function collection()
    {
        return $this->run->items;
    }

    public function headings(): array
    {
        return [
            'Nr.',
            'Emri',
            'Mbiemri',
            'Nr. Personal',
            'Pozita',
            'Paga Bruto (€)',
            'Pensioni Punëtor (€)',
            'Pensioni Punëdhënës (€)',
            'Të Ardhura Tatimore (€)',
            'TM/PIT (€)',
            'Paga Neto (€)',
            'Kosto Punëdhënësi (€)',
        ];
    }

    public function map($item): array
    {
        static $i = 0;
        $i++;
        return [
            $i,
            $item->employee->first_name,
            $item->employee->last_name,
            $item->employee->personal_number ?? '',
            $item->employee->position ?? '',
            number_format($item->gross_salary, 2),
            number_format($item->employee_pension, 2),
            number_format($item->employer_pension, 2),
            number_format($item->taxable_income, 2),
            number_format($item->pit, 2),
            number_format($item->net_salary, 2),
            number_format($item->employer_cost, 2),
        ];
    }

    public function title(): string
    {
        return "Pagesa {$this->run->period_label}";
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '2563EB']],
            ],
        ];
    }
}
