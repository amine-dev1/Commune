import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram,ArrowRight  } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#600C0C] text-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Section À propos */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Municipalité</h3>
            <p className="text-sm leading-relaxed">
              Engagés à servir notre communauté avec excellence et transparence depuis 1920.
            </p>
            <div className="flex space-x-4 mt-4">
              <Facebook className="h-6 w-6 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Liens rapides */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Liens Utiles</h3>
            <ul className="space-y-3">
              {[
                { text: 'Portail citoyen', link: '/portail' },
                { text: 'Documents officiels', link: '/documents' },
                { text: 'Appels d\'offres', link: '/appels-offres' },
                { text: 'Contact administratif', link: '/contact' },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4 text-current" />
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Coordonnées */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Nous Trouver</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 flex-shrink-0" />
                <p className="text-sm">
                  Place de la Mairie, 12345<br />
                  Ville Nouvelle, Pays
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-6 w-6" />
                <a href="tel:+123456789" className="hover:text-white transition-colors">
                  +1 234 567 89
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6" />
                <a href="mailto:contact@mairie.com" className="hover:text-white transition-colors">
                  contact@mairie.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Municipalité de Ville Nouvelle - Tous droits réservés
          </p>
          <p className="text-xs mt-2 opacity-75">
            Conçu avec ❤️ pour nos concitoyens
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;