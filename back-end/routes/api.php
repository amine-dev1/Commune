<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

 // login de l'utilisateur 
//  Route::middleware('auth:sanctum')->group(function () {
//   Route::post('logout', [AuthController::class, 'logout']);
//   Route::get('/user', [UserController::class, 'getUser']);
  
// });

// Add auth middleware (sanctum if using Sanctum)
Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'getUser']);
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

?>