<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\StatusEnum;
use App\Enums\PriorityEnum;

class Complaint extends Model
{
    protected $casts = [
        'status' => StatusEnum::class,
        'priority' => PriorityEnum::class,
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(ComplaintCategory::class);
    }

    public function attachments()
    {
        return $this->hasMany(ComplaintAttachment::class);
    }

    public function comments()
    {
        return $this->hasMany(ComplaintComment::class);
    }

    public function statusHistories()
    {
        return $this->hasMany(ComplaintStatusHistory::class);
    }
}