<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComplaintComment extends Model
{
    protected $casts = [
        'is_internal' => 'boolean',
    ];

    // Relations
    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}