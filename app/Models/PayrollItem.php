<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollItem extends Model
{
    protected $fillable = [
        'payroll_run_id', 'employee_id', 'company_id',
        'gross_salary', 'employee_pension', 'employer_pension',
        'taxable_income', 'pit', 'net_salary', 'employer_cost',
        'other_deductions', 'other_additions', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'gross_salary' => 'decimal:2',
            'employee_pension' => 'decimal:2',
            'employer_pension' => 'decimal:2',
            'taxable_income' => 'decimal:2',
            'pit' => 'decimal:2',
            'net_salary' => 'decimal:2',
            'employer_cost' => 'decimal:2',
            'other_deductions' => 'decimal:2',
            'other_additions' => 'decimal:2',
        ];
    }

    public function payrollRun()
    {
        return $this->belongsTo(PayrollRun::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
