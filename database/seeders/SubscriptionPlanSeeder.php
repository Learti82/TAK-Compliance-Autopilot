<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'basic',
                'label' => 'Bazik',
                'price_monthly' => 29.00,
                'max_employees' => 10,
                'max_companies' => 1,
                'features' => [
                    'Menaxhimi i punëtorëve (deri 10)',
                    'Llogaritja e pagave',
                    'Sistemi i pajtueshmërisë',
                    'Eksport Excel',
                    'Fajl TAK',
                    'Mbështetje me email',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'professional',
                'label' => 'Professional',
                'price_monthly' => 59.00,
                'max_employees' => 50,
                'max_companies' => 1,
                'features' => [
                    'Menaxhimi i punëtorëve (deri 50)',
                    'Llogaritja e pagave',
                    'Sistemi i pajtueshmërisë',
                    'Eksport Excel/CSV',
                    'Fajl TAK i plotë',
                    'Raportime të avancuara',
                    'Regjistri i auditimit',
                    'Mbështetje prioritare',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'enterprise',
                'label' => 'Enterprise',
                'price_monthly' => 149.00,
                'max_employees' => 0, // unlimited
                'max_companies' => 0, // unlimited
                'features' => [
                    'Punëtorë të pakufizuar',
                    'Kompani të shumta',
                    'Të gjitha veçoritë Professional',
                    'API akses',
                    'Menaxhim firmash kontabiliteti',
                    'Mbështetje 24/7',
                    'Onboarding i dedikuar',
                ],
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::firstOrCreate(['name' => $plan['name']], $plan);
        }
    }
}
