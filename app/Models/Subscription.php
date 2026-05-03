<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'company_id', 'plan_id', 'status', 'trial_ends_at',
        'current_period_start', 'current_period_end', 'cancelled_at',
        'payment_method', 'external_ref',
    ];

    protected function casts(): array
    {
        return [
            'trial_ends_at' => 'date',
            'current_period_start' => 'date',
            'current_period_end' => 'date',
            'cancelled_at' => 'date',
        ];
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function plan()
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }

    public function isActive(): bool
    {
        return $this->status === 'active' || $this->isOnTrial();
    }

    public function isOnTrial(): bool
    {
        return $this->status === 'trial' && $this->trial_ends_at?->isFuture();
    }
}
