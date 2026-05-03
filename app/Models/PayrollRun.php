<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PayrollRun extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'company_id', 'created_by', 'approved_by', 'year', 'month',
        'status', 'total_gross', 'total_net', 'total_employee_pension',
        'total_employer_pension', 'total_pit', 'total_employer_cost',
        'employee_count', 'approved_at', 'submitted_at', 'submission_deadline', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'total_gross' => 'decimal:2',
            'total_net' => 'decimal:2',
            'total_employee_pension' => 'decimal:2',
            'total_employer_pension' => 'decimal:2',
            'total_pit' => 'decimal:2',
            'total_employer_cost' => 'decimal:2',
            'approved_at' => 'datetime',
            'submitted_at' => 'datetime',
            'submission_deadline' => 'date',
        ];
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function items()
    {
        return $this->hasMany(PayrollItem::class);
    }

    public function files()
    {
        return $this->morphMany(File::class, 'fileable');
    }

    public function getPeriodLabelAttribute(): string
    {
        $months = [
            1 => 'Janar', 2 => 'Shkurt', 3 => 'Mars', 4 => 'Prill',
            5 => 'Maj', 6 => 'Qershor', 7 => 'Korrik', 8 => 'Gusht',
            9 => 'Shtator', 10 => 'Tetor', 11 => 'Nëntor', 12 => 'Dhjetor',
        ];
        return ($months[$this->month] ?? $this->month) . ' ' . $this->year;
    }

    public function isOverdue(): bool
    {
        return $this->status !== 'submitted' && now()->isAfter($this->submission_deadline);
    }

    public function canBeApproved(): bool
    {
        return $this->status === 'draft';
    }

    public function canBeSubmitted(): bool
    {
        return $this->status === 'approved';
    }
}
