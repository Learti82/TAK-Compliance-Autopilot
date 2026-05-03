<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payroll_runs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->integer('year');
            $table->integer('month'); // 1-12
            $table->string('status', 20)->default('draft'); // draft, approved, submitted
            $table->decimal('total_gross', 12, 2)->default(0);
            $table->decimal('total_net', 12, 2)->default(0);
            $table->decimal('total_employee_pension', 12, 2)->default(0);
            $table->decimal('total_employer_pension', 12, 2)->default(0);
            $table->decimal('total_pit', 12, 2)->default(0);
            $table->decimal('total_employer_cost', 12, 2)->default(0);
            $table->integer('employee_count')->default(0);
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->date('submission_deadline');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['company_id', 'year', 'month']);
            $table->index(['company_id', 'status']);
        });

        Schema::create('payroll_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_run_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->decimal('gross_salary', 10, 2)->default(0);
            $table->decimal('employee_pension', 10, 2)->default(0);   // 5% of gross
            $table->decimal('employer_pension', 10, 2)->default(0);   // 5% of gross
            $table->decimal('taxable_income', 10, 2)->default(0);     // gross - employee_pension
            $table->decimal('pit', 10, 2)->default(0);                // progressive PIT
            $table->decimal('net_salary', 10, 2)->default(0);         // taxable_income - pit
            $table->decimal('employer_cost', 10, 2)->default(0);      // gross + employer_pension
            $table->decimal('other_deductions', 10, 2)->default(0);
            $table->decimal('other_additions', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['payroll_run_id', 'employee_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payroll_items');
        Schema::dropIfExists('payroll_runs');
    }
};
