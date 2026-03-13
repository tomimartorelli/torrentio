import React, { useEffect, useState, useRef } from 'react';
import { useGameContext } from '../../context/GameContext';
import GameCard from '../GameCard/GameCard';

const Carrousell = ({ genre }) => {
  const { games } = useGameContext();
  const [filteredGames, setFilteredGames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const gamesByGenre = games.filter((game) => game.genre.toLowerCase() === genre.toLowerCase());
    setFilteredGames(gamesByGenre);
  }, [genre, games]);

  const getVisibleSlides = () => {
    if (typeof window === 'undefined') return 4;
    
    if (window.innerWidth >= 1280) return 5;
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 768) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const isMobile = () => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  };

  // Touch/Swipe handlers para mobile
  const handleMouseDown = (e) => {
    if (!isMobile()) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    if (!isMobile()) return;
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    if (!isMobile()) return;
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isMobile() || !isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Navegación para desktop
  const nextSlide = () => {
    if (isMobile()) return;
    const maxIndex = Math.max(0, filteredGames.length - getVisibleSlides());
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    if (isMobile()) return;
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const canGoNext = currentIndex < Math.max(0, filteredGames.length - getVisibleSlides());
  const canGoPrev = currentIndex > 0;

  if (filteredGames.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No hay juegos disponibles</h3>
          <p className="text-gray-500">Pronto agregaremos más juegos de {genre}</p>
        </div>
      </div>
    );
  }

  // Versión Mobile: Carrusel horizontal con scroll
  if (isMobile()) {
    return (
      <div className="relative">
        {/* Contenedor centrado para mobile */}
        <div 
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none'
          }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {filteredGames.map((game) => (
            <div 
              key={game._id} 
              className="flex-shrink-0 snap-center"
              style={{ width: 'calc(100vw - 32px)' }}
            >
              <GameCard game={game} />
            </div>
          ))}
        </div>
        
        {/* Indicadores para mobile */}
        <div className="flex justify-center mt-6 space-x-2">
          {filteredGames.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-400"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Versión Desktop: Grid con navegación
  const visibleGames = filteredGames.slice(currentIndex, currentIndex + getVisibleSlides());

  return (
    <div className="relative">
      {/* Carrusel Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {visibleGames.map((game) => (
          <div key={game._id} className="transition-all duration-300">
            <GameCard game={game} />
          </div>
        ))}
      </div>

      {/* Navegación Desktop */}
      {filteredGames.length > getVisibleSlides() && (
        <>
          {/* Botón Anterior */}
          <button
            onClick={prevSlide}
            disabled={!canGoPrev}
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
              canGoPrev 
                ? 'opacity-100 pointer-events-auto' 
                : 'opacity-50 pointer-events-none'
            } group-hover:opacity-100 opacity-0 md:opacity-100`}
          >
            <i className="fas fa-chevron-left text-lg"></i>
          </button>

          {/* Botón Siguiente */}
          <button
            onClick={nextSlide}
            disabled={!canGoNext}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
              canGoNext 
                ? 'opacity-100 pointer-events-auto' 
                : 'opacity-50 pointer-events-none'
            } group-hover:opacity-100 opacity-0 md:opacity-100`}
          >
            <i className="fas fa-chevron-right text-lg"></i>
          </button>
        </>
      )}

      {/* Indicadores Desktop */}
      {filteredGames.length > getVisibleSlides() && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.ceil(filteredGames.length / getVisibleSlides()) }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * getVisibleSlides())}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / getVisibleSlides()) === index
                  ? 'bg-purple-500 scale-125'
                  : 'bg-gray-400 hover:bg-gray-300'
              }`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carrousell;