<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('compliance_deadlines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type', 50); // monthly_payroll, annual_pit, employee_registration
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('due_date');
            $table->string('status', 20)->default('pending'); // pending, completed, overdue, waived
            $table->boolean('alert_sent')->default(false);
            $table->timestamp('alert_sent_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->foreignId('completed_by')->nullable()->constrained('users');
            $table->integer('reference_year')->nullable();
            $table->integer('reference_month')->nullable();
            $table->timestamps();

            $table->index(['company_id', 'status', 'due_date']);
            $table->index(['due_date', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('compliance_deadlines');
    }
};
