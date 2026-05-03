<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'fiscal_number', 'tak_username', 'tak_password',
        'address', 'city', 'phone', 'email', 'industry',
        'employee_count', 'status', 'founded_at', 'logo', 'settings',
    ];

    protected function casts(): array
    {
        return [
            'founded_at' => 'date',
            'settings' => 'array',
        ];
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function activeEmployees()
    {
        return $this->hasMany(Employee::class)->where('status', 'active');
    }

    public function payrollRuns()
    {
        return $this->hasMany(PayrollRun::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class)->where('status', 'active')->latest();
    }

    public function complianceDeadlines()
    {
        return $this->hasMany(ComplianceDeadline::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function files()
    {
        return $this->hasMany(File::class);
    }

    public function getComplianceScoreAttribute(): array
    {
        $now = now();
        $overdueCount = $this->complianceDeadlines()
            ->where('status', 'overdue')
            ->count();
        $pendingCount = $this->complianceDeadlines()
            ->where('status', 'pending')
            ->where('due_date', '<=', $now->copy()->addDays(7))
            ->count();

        if ($overdueCount > 0) {
            return ['level' => 'red', 'label' => 'Kritike', 'score' => max(0, 100 - ($overdueCount * 30))];
        }
        if ($pendingCount > 0) {
            return ['level' => 'yellow', 'label' => 'Kujdes', 'score' => max(40, 100 - ($pendingCount * 10))];
        }
        return ['level' => 'green', 'label' => 'Mirë', 'score' => 100];
    }
}
