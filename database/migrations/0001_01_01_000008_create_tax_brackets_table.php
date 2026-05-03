<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tax_brackets', function (Blueprint $table) {
            $table->id();
            $table->string('type', 30)->default('pit'); // pit, pension_employee, pension_employer
            $table->decimal('min_amount', 10, 2)->default(0);
            $table->decimal('max_amount', 10, 2)->nullable(); // null = no upper limit
            $table->decimal('rate', 5, 4); // e.g. 0.0400 = 4%
            $table->integer('tax_year');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['type', 'tax_year', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tax_brackets');
    }
};
