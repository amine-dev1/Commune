<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Rendre les colonnes nullable temporairement
            $table->string('phone')->nullable()->change();
            $table->string('cin')->nullable()->change();
            $table->string('address')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Revertir à NOT NULL (si nécessaire)
            $table->string('phone')->nullable(false)->change();
            $table->string('cin')->nullable(false)->change();
            $table->string('address')->nullable(false)->change();
        });
    }
};