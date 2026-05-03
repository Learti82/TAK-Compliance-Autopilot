<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('personal_number', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->date('birth_date')->nullable();
            $table->string('address')->nullable();
            $table->string('bank_account', 50)->nullable();
            $table->string('bank_name', 100)->nullable();
            $table->string('position', 150)->nullable();
            $table->string('department', 100)->nullable();
            $table->string('contract_type', 30)->default('full_time'); // full_time, part_time, contract
            $table->decimal('gross_salary', 10, 2)->default(0);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->date('tak_registered_at')->nullable(); // date registered with TAK
            $table->string('status', 20)->default('active'); // active, inactive, terminated
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['company_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
