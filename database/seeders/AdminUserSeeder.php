<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Services\ComplianceService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin (no company)
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@tak-autopilot.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );
        $superAdmin->assignRole('super_admin');

        // Demo company
        $company = Company::firstOrCreate(
            ['fiscal_number' => '600123456'],
            [
                'name' => 'Demo SH.P.K.',
                'city' => 'Prishtinë',
                'address' => 'Rruga Demo, Nr. 1',
                'phone' => '+383 44 000 001',
                'email' => 'demo@company.com',
                'industry' => 'Teknologji',
                'status' => 'active',
            ]
        );

        // Assign Professional subscription to demo company
        $plan = SubscriptionPlan::where('name', 'professional')->first();
        if ($plan) {
            Subscription::firstOrCreate(
                ['company_id' => $company->id],
                [
                    'plan_id' => $plan->id,
                    'status' => 'active',
                    'current_period_start' => now()->startOfMonth(),
                    'current_period_end' => now()->endOfMonth()->addMonths(12),
                ]
            );
        }

        // Company Admin user
        $companyAdmin = User::firstOrCreate(
            ['email' => 'admin@demo.com'],
            [
                'name' => 'Blerim Krasniqi',
                'password' => Hash::make('password'),
                'company_id' => $company->id,
                'is_active' => true,
            ]
        );
        $companyAdmin->assignRole('company_admin');

        // HR user
        $hrUser = User::firstOrCreate(
            ['email' => 'hr@demo.com'],
            [
                'name' => 'Liridon Berisha',
                'password' => Hash::make('password'),
                'company_id' => $company->id,
                'is_active' => true,
            ]
        );
        $hrUser->assignRole('hr');

        // Demo employees
        $employees = [
            ['first_name' => 'Agron', 'last_name' => 'Morina', 'position' => 'Inxhinier Softuerësh', 'gross_salary' => 1200, 'start_date' => '2023-01-15', 'tak_registered_at' => '2023-01-14'],
            ['first_name' => 'Drita', 'last_name' => 'Gashi', 'position' => 'Dizajner UX', 'gross_salary' => 900, 'start_date' => '2023-03-01', 'tak_registered_at' => '2023-02-28'],
            ['first_name' => 'Valdrin', 'last_name' => 'Hoxha', 'position' => 'Menaxher Projekti', 'gross_salary' => 1500, 'start_date' => '2022-06-01', 'tak_registered_at' => '2022-05-30'],
            ['first_name' => 'Flutura', 'last_name' => 'Kelmendi', 'position' => 'Kontabiliste', 'gross_salary' => 800, 'start_date' => '2023-09-01', 'tak_registered_at' => '2023-08-31'],
            ['first_name' => 'Besnik', 'last_name' => 'Rama', 'position' => 'Zhvillues Backend', 'gross_salary' => 1100, 'start_date' => '2024-01-02', 'tak_registered_at' => null],
        ];

        foreach ($employees as $empData) {
            \App\Models\Employee::firstOrCreate(
                ['company_id' => $company->id, 'first_name' => $empData['first_name'], 'last_name' => $empData['last_name']],
                [
                    'company_id' => $company->id,
                    'contract_type' => 'full_time',
                    'status' => 'active',
                    ...$empData,
                ]
            );
        }

        // Seed compliance deadlines
        $compliance = app(ComplianceService::class);
        $compliance->seedDeadlines($company);
    }
}
