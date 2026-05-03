<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ComplianceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TaxBracketController;
use Illuminate\Support\Facades\Route;

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.submit');
});

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Employees
    Route::resource('employees', EmployeeController::class);

    // Payroll
    Route::prefix('payroll')->name('payroll.')->group(function () {
        Route::get('/', [PayrollController::class, 'index'])->name('index');
        Route::get('/create', [PayrollController::class, 'create'])->name('create');
        Route::post('/', [PayrollController::class, 'store'])->name('store');
        Route::get('/{payrollRun}', [PayrollController::class, 'show'])->name('show');
        Route::post('/{payrollRun}/approve', [PayrollController::class, 'approve'])->name('approve');
        Route::post('/{payrollRun}/submit', [PayrollController::class, 'submit'])->name('submit');
        Route::post('/{payrollRun}/regenerate', [PayrollController::class, 'regenerate'])->name('regenerate');
        Route::get('/{payrollRun}/export', [PayrollController::class, 'export'])->name('export');
        Route::get('/{payrollRun}/tak-file', [PayrollController::class, 'takFile'])->name('tak_file');
    });

    // Compliance
    Route::prefix('compliance')->name('compliance.')->group(function () {
        Route::get('/', [ComplianceController::class, 'index'])->name('index');
        Route::post('/{deadline}/complete', [ComplianceController::class, 'markComplete'])->name('complete');
        Route::post('/{deadline}/waive', [ComplianceController::class, 'markWaived'])->name('waive');
    });

    // Company profile
    Route::prefix('company')->name('company.')->group(function () {
        Route::get('/', [CompanyController::class, 'show'])->name('show');
        Route::get('/edit', [CompanyController::class, 'edit'])->name('edit');
        Route::put('/', [CompanyController::class, 'update'])->name('update');
    });

    // Reports
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/payroll', [ReportController::class, 'payroll'])->name('payroll');
        Route::get('/employees', [ReportController::class, 'employees'])->name('employees');
    });

    // Audit logs
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit_logs.index');

    // Admin-only routes
    Route::middleware('role:super_admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/companies', [CompanyController::class, 'adminIndex'])->name('companies.index');
        Route::resource('/tax-brackets', TaxBracketController::class)->except(['create', 'show', 'edit']);
    });
});
