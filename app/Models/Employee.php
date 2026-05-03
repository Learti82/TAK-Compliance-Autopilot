<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'company_id', 'first_name', 'last_name', 'personal_number',
        'email', 'phone', 'birth_date', 'address',
        'bank_account', 'bank_name', 'position', 'department',
        'contract_type', 'gross_salary', 'start_date', 'end_date',
        'tak_registered_at', 'status', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'start_date' => 'date',
            'end_date' => 'date',
            'tak_registered_at' => 'date',
            'gross_salary' => 'decimal:2',
        ];
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function payrollItems()
    {
        return $this->hasMany(PayrollItem::class);
    }

    public function complianceDeadlines()
    {
        return $this->hasMany(ComplianceDeadline::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function isNotRegisteredBeforeStartDate(): bool
    {
        if (!$this->tak_registered_at) {
            return true;
        }
        return $this->tak_registered_at > $this->start_date;
    }

    public function needsRegistrationWarning(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }
        return $this->isNotRegisteredBeforeStartDate();
    }
}
