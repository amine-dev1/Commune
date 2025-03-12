import React from 'react';
import { FileText, UserCheck, Clock, ArrowRight } from 'lucide-react';
import ImageSlider from '../Components/ImageSlider';
import Navbar from '../components/Navbar';
import Footer from '../Components/Footer';
const services = [
  {
    icon: <FileText className="h-12 w-12 text-[#600C0C]" />,
    title: "Réclamations",
    description: "Soumettez et suivez vos réclamations en ligne",
    link: "/reclamations"
  },
  {
    icon: <UserCheck className="h-12 w-12 text-[#600C0C]" />,
    title: "État Civil",
    description: "Accédez à vos documents d'état civil",
    link: "/etat-civil"
  },
  {
    icon: <Clock className="h-12 w-12 text-[#600C0C]" />,
    title: "Rendez-vous",
    description: "Prenez rendez-vous pour vos démarches",
    link: "/rendez-vous"
  }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section with Slider */}
      <section className="relative">
        <ImageSlider />
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
            Nos Services en Ligne
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 transform hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <a
                  href={service.link}
                  className="inline-flex items-center text-[#600C0C] hover:text-[#500A0A] font-medium group-hover:translate-x-2 transition-transform duration-300"
                >
                  En savoir plus
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-[#600C0C] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-lg bg-white/10 backdrop-blur-lg">
              <h3 className="text-4xl font-bold text-white mb-2">15,000+</h3>
              <p className="text-gray-200">Citoyens Servis</p>
            </div>
            <div className="p-8 rounded-lg bg-white/10 backdrop-blur-lg">
              <h3 className="text-4xl font-bold text-white mb-2">98%</h3>
              <p className="text-gray-200">Taux de Satisfaction</p>
            </div>
            <div className="p-8 rounded-lg bg-white/10 backdrop-blur-lg">
              <h3 className="text-4xl font-bold text-white mb-2">24/7</h3>
              <p className="text-gray-200">Service Disponible</p>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default Home;