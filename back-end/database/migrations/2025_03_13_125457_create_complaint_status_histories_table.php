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
        // database/migrations/xxxx_xx_xx_xxxxxx_create_complaint_status_history_table.php

        Schema::create('complaint_status_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('complaint_id')->constrained('complaints')->onDelete('cascade');
            $table->enum('status', ['pending', 'in_review', 'in_progress', 'resolved', 'rejected']);
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('note')->nullable();
            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaint_status_histories');
    }
};
