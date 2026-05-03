<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    protected $fillable = [
        'name', 'label', 'price_monthly', 'max_employees', 'max_companies', 'features', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price_monthly' => 'decimal:2',
            'features' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'plan_id');
    }
}
