import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Drapeau from '../assets/backgrounds/Drapeau-marocain.jpg';

const slides = [
  {
    image: Drapeau,
    title: "Commune de Mohammedia",
    description: "Votre portail pour les services municipaux"
  },
  {
    image: Drapeau,
    title: "Services en Ligne",
    description: "Simplifiez vos démarches administratives"
  },
  {
    image: Drapeau,
    title: "État Civil",
    description: "Gérez vos documents d'état civil en ligne"
  }
];

const ImageSlider = () => {
  return (
    <Swiper
      modules={[Autoplay, EffectFade, Navigation, Pagination]}
      effect="fade"
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      loop
      className="h-[600px] w-full"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="relative w-full h-full">
            {/* Ensure the image is correctly displayed */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <h2 className="mb-4 text-4xl font-bold text-white animate-fade-in">
                    {slide.title}
                  </h2>
                  <p className="text-xl text-white animate-fade-in animation-delay-200">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageSlider;
