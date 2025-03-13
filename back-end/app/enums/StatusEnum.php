<?php

namespace App\Enums;

enum StatusEnum: string
{
    case Pending = 'pending';
    case InReview = 'in_review';
    case InProgress = 'in_progress';
    case Resolved = 'resolved';
    case Rejected = 'rejected';
} 
?>