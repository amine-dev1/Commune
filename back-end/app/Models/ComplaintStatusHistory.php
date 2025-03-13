<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\StatusEnum;

class ComplaintStatusHistory extends Model
{
    protected $casts = [
        'status' => StatusEnum::class,
    ];

    // Désactive les timestamps car la table n'a que created_at
    public $timestamps = false;

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