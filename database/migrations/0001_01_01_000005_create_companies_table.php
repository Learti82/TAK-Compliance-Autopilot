<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('fiscal_number', 50)->unique();
            $table->string('tak_username')->nullable();
            $table->string('tak_password')->nullable();
            $table->string('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('industry', 100)->nullable();
            $table->integer('employee_count')->default(0);
            $table->string('status', 20)->default('active'); // active, suspended, trial
            $table->date('founded_at')->nullable();
            $table->string('logo')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
