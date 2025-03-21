import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

const Dashboard = ({ user, onLogout }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newReclamation, setNewReclamation] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    priority: 'medium',
    files: [],
    tags: []
  });

  const categories = [
    { value: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
    { value: 'cleanliness', label: 'Propreté', icon: '🧹' },
    { value: 'roads', label: 'Voirie', icon: '🛣️' },
    { value: 'security', label: 'Sécurité', icon: '👮' },
    { value: 'other', label: 'Autre', icon: '❓' },
  ];

  const priorities = [
    { value: 'high', label: 'Haute', color: 'red' },
    { value: 'medium', label: 'Moyenne', color: 'orange' },
    { value: 'low', label: 'Basse', color: 'green' },
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewReclamation(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* New Reclamation Modal */}
      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />

          <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 p-8 shadow-2xl">
            <Dialog.Title className="text-2xl font-bold text-[#600C0C] mb-6">
              Nouvelle Réclamation
            </Dialog.Title>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title Input */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la réclamation *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#600C0C] focus:border-[#600C0C]"
                    placeholder="Décrivez brièvement le problème"
                  />
                </div>

                {/* Category Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#600C0C]"
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priorité *
                  </label>
                  <div className="flex gap-2">
                    {priorities.map((prio) => (
                      <button
                        key={prio.value}
                        type="button"
                        className={`flex-1 py-2 px-4 rounded-lg border ${
                          newReclamation.priority === prio.value 
                            ? `border-${prio.color}-500 bg-${prio.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className={`text-${prio.color}-600 font-medium`}>
                          {prio.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Picker */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localisation *
                  </label>
                  <div className="h-48 bg-gray-100 rounded-lg border-2 border-dashed flex items-center justify-center">
                    <span className="text-gray-500">
                      🗺️ Cliquez pour sélectionner sur la carte
                    </span>
                  </div>
                </div>

                {/* Rich Text Editor */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description détaillée *
                  </label>
                  <div className="border rounded-lg p-4 min-h-[200px]">
                    <div className="flex gap-2 mb-4 border-b pb-2">
                      <button type="button" className="p-1 hover:bg-gray-100 rounded">
                        <strong>B</strong>
                      </button>
                      <button type="button" className="p-1 hover:bg-gray-100 rounded">
                        <em>I</em>
                      </button>
                      <button type="button" className="p-1 hover:bg-gray-100 rounded">
                        🖼️
                      </button>
                      <button type="button" className="p-1 hover:bg-gray-100 rounded">
                        📎
                      </button>
                    </div>
                    <textarea
                      className="w-full h-32 p-2 focus:outline-none"
                      placeholder="Décrivez en détail le problème rencontré..."
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pièces jointes
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer"
                    >
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600">
                        Glissez vos fichiers ici ou{' '}
                        <span className="text-[#600C0C] font-medium">parcourir</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Formats supportés: JPG, PNG, PDF (max. 10MB par fichier)
                      </p>
                    </label>
                  </div>
                  <div className="mt-4 space-y-2">
                    {newReclamation.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">📎 {file.name}</span>
                        <span className="text-gray-500 text-sm">{Math.round(file.size / 1024)} KB</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#600C0C] text-white rounded-lg hover:bg-[#500A0A] flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Soumettre la réclamation
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      {/* Main Dashboard Interface */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          
          {/* Enhanced Header */}
          <div className="bg-[#600C0C] px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">CommuneHub Dashboard</h1>
              <p className="text-gray-200 mt-1">Plateforme de gestion des réclamations citoyennes</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-2 rounded-full">
                <span className="text-white">📅 {new Date().toLocaleDateString()}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
              >
                <span className="text-white">🚪 Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-8 space-y-8">
            
            {/* User Profile Card */}
            <div className="bg-gradient-to-r from-[#600C0C]/5 to-[#600C0C]/10 p-6 rounded-xl flex items-center gap-6">
              <div className="bg-[#600C0C] text-white p-4 rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Bonjour, {user?.name}</h2>
                <div className="flex gap-6 mt-2">
                  <div className="pr-6 border-r border-gray-200">
                    <p className="text-gray-600"><span className="font-medium">Role:</span> {user?.role}</p>
                  </div>
                  <div>
                    <p className="text-gray-600"><span className="font-medium">Dernière connexion:</span> 15 mars 2024</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#600C0C] text-white p-6 rounded-xl">
                <div className="text-3xl font-bold">24h</div>
                <div className="text-sm opacity-90">Temps moyen de réponse</div>
              </div>
              <div className="bg-white border-2 border-[#600C0C] p-6 rounded-xl">
                <div className="text-3xl font-bold text-[#600C0C]">92%</div>
                <div className="text-sm text-gray-600">Taux de résolution</div>
              </div>
              <div className="bg-white shadow-lg p-6 rounded-xl">
                <div className="text-3xl font-bold">15</div>
                <div className="text-sm text-gray-600">Réclamations actives</div>
              </div>
              <div className="bg-white shadow-lg p-6 rounded-xl">
                <div className="text-3xl font-bold">4.8★</div>
                <div className="text-sm text-gray-600">Satisfaction citoyens</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Vos réclamations</h3>
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-[#600C0C] text-white px-6 py-3 rounded-lg hover:bg-[#500A0A] flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Nouvelle Réclamation
              </button>
            </div>

            {/* Enhanced Reclamations Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Titre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Priorité</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Pièces jointes</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[/* Add your data here */].map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium">{item.title}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          ● {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          item.priority === 'high' ? 'bg-red-100 text-red-800' :
                          item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{item.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <span className="bg-gray-100 p-1 rounded">📎 2</span>
                          <span className="bg-gray-100 p-1 rounded">🖼️ 3</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#600C0C] hover:bg-gray-100 p-2 rounded">
                          ✏️ Modifier
                        </button>
                        <button className="text-red-600 hover:bg-gray-100 p-2 rounded ml-2">
                          🗑 Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;