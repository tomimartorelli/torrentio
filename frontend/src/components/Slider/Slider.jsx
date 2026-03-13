import React, { useState, useEffect } from "react";
import OptimizedImage from "../OptimizedImage/OptimizedImage";

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      src: "/images/banner1.jpg",
      alt: "Banner 1",
      title: "Descubre Nuevos Mundos",
      subtitle: "Explora aventuras épicas y sumérgete en historias increíbles",
      gradient: "from-purple-600/80 to-pink-600/80"
    },
    {
      src: "/images/banner2.jpg", 
      alt: "Banner 2",
      title: "Acción Sin Límites",
      subtitle: "Vive la emoción del gaming con los mejores títulos de acción",
      gradient: "from-red-600/80 to-orange-600/80"
    },
    {
      src: "/images/banner3.jpg",
      alt: "Banner 3", 
      title: "RPG Legendarios",
      subtitle: "Sumérgete en historias épicas y mundos fantásticos",
      gradient: "from-blue-600/80 to-cyan-600/80"
    },
    {
      src: "/images/banner4.jpeg",
      alt: "Banner 4",
      title: "Deportes Extremos", 
      subtitle: "Compite al más alto nivel con los mejores juegos deportivos",
      gradient: "from-green-600/80 to-emerald-600/80"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-full group">
      {/* Slides Container */}
      <div className="relative w-full h-full overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
          >
            <div className="relative w-full h-full">
              <OptimizedImage 
                src={banner.src} 
                alt={banner.alt}
                className="w-full h-full"
                fallback="/images/placeholder-banner.jpg"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} via-black/40 to-transparent`}></div>
              
              {/* Contenido del banner */}
              <div className="absolute inset-0 flex items-center justify-start px-8 md:px-16 lg:px-24 xl:px-32">
                <div className="text-white max-w-2xl">
                  <div className="mb-6">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                      {banner.title}
                    </h2>
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed">
                      {banner.subtitle}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                      <i className="fas fa-play text-sm"></i>
                      Explorar Ahora
                    </button>
                    <button className="px-8 py-4 bg-transparent border-2 border-white/50 text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                      <i className="fas fa-info-circle text-sm"></i>
                      Más Información
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navegación */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Botón Anterior */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 transform hover:scale-110 pointer-events-auto group-hover:opacity-100 opacity-0 md:opacity-100"
        >
          <i className="fas fa-chevron-left text-xl"></i>
        </button>

        {/* Botón Siguiente */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 transform hover:scale-110 pointer-events-auto group-hover:opacity-100 opacity-0 md:opacity-100"
        >
          <i className="fas fa-chevron-right text-xl"></i>
        </button>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;