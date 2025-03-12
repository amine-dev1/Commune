import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import '../styles/register.css';
const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Gestion des messages d'erreur (2.5s)
  useEffect(() => {
    let timeoutId;
    if (error) {
      timeoutId = setTimeout(() => setError(''), 2500);
    }
    return () => clearTimeout(timeoutId);
  }, [error]);

  // Gestion de la réussite et redirection (3s)
  useEffect(() => {
    let timeoutId;
    if (success) {
      timeoutId = setTimeout(() => {
        setSuccess('');
        navigate('/login'); // Redirection vers Login
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [success, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas ❌');
      return;
    }

    try {
      await register({ name, email, password });
      
      setSuccess('Inscription réussie ! Redirection vers la connexion... ✔️');
      setError('');
      
      // Réinitialisation du formulaire
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
      setSuccess('');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen animated-background relative overflow-hidden">
      <div className="floating-circles absolute inset-0" />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md mt-10">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
            {/* Header */}
            <div className="bg-[#600C0C] px-8 py-6 text-center">
              <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <UserPlus className="w-6 h-6" />
                Créer un compte
              </h2>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleRegister} className="p-10 space-y-7">
              <div className="space-y-5">
                {/* Champ Nom */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-6 w-6 text-[#600C0C]" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom Complet"
                    required
                    className="block w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#600C0C] focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Champ Email */}
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

                {/* Champ Mot de passe */}
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

                {/* Confirmation mot de passe */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-6 w-6 text-[#600C0C]" />
                  </div>
                  <input
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Confirmer le mot de passe"
                    required
                    className="block w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#600C0C] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Bouton d'envoi */}
              <button
                type="submit"
                className="cursor-pointer w-full bg-[#600C0C] text-white py-3 px-6 rounded-lg hover:bg-[#500A0A] transform hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-3 text-lg font-semibold"
              >
                <UserPlus className="w-6 h-6" />
                S'enregistrer
              </button>

              {/* Messages d'état */}
              {error && (
                <p className="text-red-600 text-center text-base mt-3 animate-fade-in">{error}</p>
              )}
              {success && (
                <p className="text-green-600 text-center text-base mt-3 animate-fade-in">{success}</p>
              )}
            </form>

            {/* Footer avec lien de connexion */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-sm text-center text-gray-600">
                Déjà inscrit?{' '}
                <a href="/login" className="text-[#600C0C] hover:underline font-medium">
                  Connectez-vous ici
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;