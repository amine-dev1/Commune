<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users','id')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('complaint_categories')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('location');
            $table->enum('status', ['pending', 'in_review', 'in_progress', 'resolved', 'rejected'])->default('pending');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('low');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
