<?php
use App\Http\Controllers\AuthController;;
use Illuminate\Support\Facades\Route;

 // login de l'utilisateur 
Route::post('login', [AuthController::class, 'login'])->withoutMiddleware(['sanctum.auth']);

// enregistrement de l'utilisateur 
Route::post('/register', [AuthController::class, 'register']);

// déconnexion de l'utilisateur (protégée par le middleware d'authentification)
Route::post('logout',[AuthController::class, 'logout'])->middleware('sanctum.auth'); 

Route::get('test',function(){return response()->json(['message'=> "hello world"]);})
?>