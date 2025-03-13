<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComplaintAttachment extends Model
{
    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }
}