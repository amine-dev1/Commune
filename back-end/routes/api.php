<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ComplaintsController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', [UserController::class, 'getUser']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('/complaints', [ComplaintsController::class, 'index']);
    Route::get('/complaints/user', [ComplaintsController::class, 'getUserComplaints']);
    Route::get('/complaints/{id}', [ComplaintsController::class, 'show']);
    Route::post('/complaints', [ComplaintsController::class, 'store']);
    Route::put('/complaints/{id}', [ComplaintsController::class, 'update']);
    Route::delete('/complaints/{id}', [ComplaintsController::class, 'destroy']);
    
    // Comments
    Route::post('/complaints/{id}/comments', [ComplaintsController::class, 'addComment']);
    Route::delete('/complaints/{complaintId}/comments/{commentId}', [ComplaintsController::class, 'deleteComment']);
    
    // Attachments
    Route::get('/complaints/{id}/attachments', [ComplaintsController::class, 'getAttachments']);
    Route::get('/complaints/{complaintId}/attachments/{attachmentId}/download', [ComplaintsController::class, 'downloadAttachment']);
    Route::delete('/complaints/{complaintId}/attachments/{attachmentId}', [ComplaintsController::class, 'deleteAttachment']);
    
    // Status history
    Route::get('/complaints/{id}/history', [ComplaintsController::class, 'getStatusHistory']);
    
    // Statistics (admin/moderator only)
    Route::get('/complaints/statistics/dashboard', [ComplaintsController::class, 'getStatistics']);
});