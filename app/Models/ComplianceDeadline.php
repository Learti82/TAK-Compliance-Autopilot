<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComplianceDeadline extends Model
{
    protected $fillable = [
        'company_id', 'employee_id', 'type', 'title', 'description',
        'due_date', 'status', 'alert_sent', 'alert_sent_at',
        'completed_at', 'completed_by', 'reference_year', 'reference_month',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'alert_sent' => 'boolean',
            'alert_sent_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function completedBy()
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    public function isOverdue(): bool
    {
        return $this->status === 'pending' && now()->isAfter($this->due_date);
    }

    public function isDueSoon(): bool
    {
        return $this->status === 'pending'
            && now()->isBefore($this->due_date)
            && now()->diffInDays($this->due_date) <= 7;
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'Në pritje',
            'completed' => 'Kompletuar',
            'overdue' => 'Vonuar',
            'waived' => 'Hequr',
            default => $this->status,
        };
    }

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'monthly_payroll' => 'Pagë mujore',
            'annual_pit' => 'TVSH vjetore',
            'employee_registration' => 'Regjistrim punëtori',
            default => $this->type,
        };
    }
}
