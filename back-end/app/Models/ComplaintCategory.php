<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComplaintCategory extends Model
{
    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }
}