import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { LogIn, Mail, Lock } from 'lucide-react';
import '../styles/login.css';

const Login = ({ checkAuth }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(''), 2500);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login({ email, password });
      setSuccess('Connexion réussie ! Redirection en cours... ✔️');
      setError('');
      setEmail('');
      setPassword('');

      setTimeout(async () => {
        const isAuthenticated = await checkAuth();
        if (isAuthenticated) navigate('/dashboard');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Identifiants incorrects ❌');
      setSuccess('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen animated-background relative overflow-hidden">
      <div className="floating-circles absolute inset-0" />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md mt-10">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
            <div className="bg-[#600C0C] px-8 py-6 text-center">
              <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <LogIn className="w-6 h-6" />
                Connexion
              </h2>
            </div>

            <form onSubmit={handleLogin} className="p-10 space-y-7">
              <div className="space-y-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-6 w-6 text-[#600C0C]" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="block w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#600C0C] focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-6 w-6 text-[#600C0C]" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    required
                    className="block w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#600C0C] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="text-right">
                <a href="/forgot-password" className="text-sm text-[#600C0C] hover:underline">
                  Mot de passe oublié?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#600C0C] text-white py-3 px-6 rounded-lg hover:bg-[#500A0A] transition-all duration-200 flex items-center justify-center gap-3 text-lg font-semibold disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="w-6 h-6" />
                    Se connecter
                  </>
                )}
              </button>

              {error && <p className="text-red-600 text-center animate-fade-in">{error}</p>}
              {success && <p className="text-green-600 text-center animate-fade-in">{success}</p>}
            </form>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-sm text-center text-gray-600">
                Pas encore de compte?{' '}
                <a href="/register" className="text-[#600C0C] hover:underline font-medium">
                  Inscrivez-vous ici
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;