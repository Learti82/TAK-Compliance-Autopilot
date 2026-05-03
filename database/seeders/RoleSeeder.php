<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Clear permission cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Companies
            'view_companies', 'manage_companies',
            // Employees
            'view_employees', 'create_employees', 'edit_employees', 'delete_employees',
            // Payroll
            'view_payroll', 'create_payroll', 'approve_payroll', 'submit_payroll', 'export_payroll',
            // Compliance
            'view_compliance', 'manage_compliance',
            // Reports
            'view_reports',
            // Audit logs
            'view_audit_logs',
            // Settings / tax brackets
            'manage_tax_brackets',
            // Subscriptions
            'manage_subscriptions',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        // Super Admin – full access
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $superAdmin->syncPermissions(Permission::all());

        // Accounting Firm – manages multiple companies
        $accountingFirm = Role::firstOrCreate(['name' => 'accounting_firm', 'guard_name' => 'web']);
        $accountingFirm->syncPermissions([
            'view_companies', 'view_employees', 'create_employees', 'edit_employees',
            'view_payroll', 'create_payroll', 'approve_payroll', 'submit_payroll', 'export_payroll',
            'view_compliance', 'manage_compliance',
            'view_reports', 'view_audit_logs',
        ]);

        // Company Admin – manages own company
        $companyAdmin = Role::firstOrCreate(['name' => 'company_admin', 'guard_name' => 'web']);
        $companyAdmin->syncPermissions([
            'view_employees', 'create_employees', 'edit_employees', 'delete_employees',
            'view_payroll', 'create_payroll', 'approve_payroll', 'submit_payroll', 'export_payroll',
            'view_compliance', 'manage_compliance',
            'view_reports', 'view_audit_logs',
        ]);

        // HR – employee management only
        $hr = Role::firstOrCreate(['name' => 'hr', 'guard_name' => 'web']);
        $hr->syncPermissions([
            'view_employees', 'create_employees', 'edit_employees',
            'view_payroll',
            'view_compliance',
            'view_reports',
        ]);

        // Auditor – read only
        $auditor = Role::firstOrCreate(['name' => 'auditor', 'guard_name' => 'web']);
        $auditor->syncPermissions([
            'view_employees', 'view_payroll', 'view_compliance', 'view_reports', 'view_audit_logs',
        ]);
    }
}
