import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  const getGenreColor = (genre) => {
    const colors = {
      'Acción': 'bg-red-500',
      'Aventura': 'bg-blue-500',
      'RPG': 'bg-purple-600',
      'Estrategia': 'bg-emerald-600',
      'Deportes': 'bg-orange-500',
      'Carreras': 'bg-yellow-500',
      'Simulación': 'bg-indigo-600',
      'Terror': 'bg-zinc-800',
      'Plataformas': 'bg-pink-500',
      'Lucha': 'bg-red-700'
    };
    return colors[genre] || 'bg-zinc-500';
  };

  const getGenreIcon = (genre) => {
    const icons = {
      'Acción': 'fas fa-fire',
      'Aventura': 'fas fa-compass',
      'RPG': 'fas fa-khanda',
      'Estrategia': 'fas fa-chess',
      'Deportes': 'fas fa-futbol',
      'Carreras': 'fas fa-car',
      'Simulación': 'fas fa-laptop-code',
      'Terror': 'fas fa-ghost',
      'Plataformas': 'fas fa-gamepad',
      'Lucha': 'fas fa-hand-fist'
    };
    return icons[genre] || 'fas fa-gamepad';
  };

  return (
    <Link to={`/gameList/gameDetails/${game._id}`} className="block h-full group">
      <div className="bg-surface border border-themed/60 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {game.image ? (
            <img
              src={`http://localhost:5000/${game.image}`}
              alt={game.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.src = '/images/placeholder-game.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <i className="fas fa-gamepad text-muted text-4xl"></i>
            </div>
          )}
          
          {/* Rating Overlay */}
          {game.rating && (
            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border border-white/20">
              <i className="fas fa-star text-yellow-400"></i>
              <span>{game.rating}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Genre & Date */}
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${getGenreColor(game.genre)} uppercase tracking-wider`}>
              <i className={`${getGenreIcon(game.genre)}`}></i>
              <span>{game.genre}</span>
            </div>
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{game.releaseYear}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-primary mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
            {game.title}
          </h3>
          
          {/* Developer */}
          <p className="text-xs text-secondary font-medium mb-4 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-purple-500"></span>
            {game.developer}
          </p>
          
          {/* Footer Info */}
          <div className="mt-auto pt-4 border-t border-themed/40 flex items-center justify-between text-[10px] font-bold text-muted uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <i className="fas fa-hard-drive opacity-50"></i>
              <span>{game.weight || 'N/A'} GB</span>
            </div>
            <div className="flex items-center gap-1 group/btn">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">Ver más</span>
              <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
