<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->morphs('fileable'); // polymorphic: payroll_run, employee, company
            $table->string('type', 50); // payroll_export, tak_file, employee_contract, etc.
            $table->string('name');
            $table->string('path');
            $table->string('disk', 30)->default('local');
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('size')->nullable(); // bytes
            $table->timestamps();

            $table->index(['company_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
