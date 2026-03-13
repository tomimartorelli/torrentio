import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category, gameCount, description, color, icon, featuredGames = [] }) => {
  return (
    <Link 
      to={`/categories/${encodeURIComponent(category)}`}
      className="group block h-full"
    >
      <div className="bg-surface border border-themed/60 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 h-full flex flex-col p-8">
        {/* Icon & Title Section */}
        <div className="flex items-start justify-between mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${color || 'bg-purple-50 dark:bg-purple-900/20'}`}>
            <i className={`${icon} text-2xl ${color ? 'text-white' : 'text-purple-600'}`}></i>
          </div>
          <div className="bg-secondary/50 px-4 py-1.5 rounded-full">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{gameCount} juegos</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-purple-600 transition-colors tracking-tight">
          {category}
        </h3>
        
        <p className="text-sm text-secondary leading-relaxed mb-8 opacity-80 line-clamp-3">
          {description}
        </p>

        {/* Featured Games Avatars */}
        {featuredGames.length > 0 && (
          <div className="mb-8">
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">Destacados</p>
            <div className="flex -space-x-3">
              {featuredGames.slice(0, 4).map((game, index) => (
                <div 
                  key={game._id || index}
                  className="w-10 h-10 rounded-full bg-surface border-2 border-primary/10 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-110 hover:z-20 relative ring-4 ring-surface"
                  title={game.title}
                  style={{ zIndex: 10 - index }}
                >
                  {game.image ? (
                    <img src={`http://localhost:5000/${game.image}`} alt={game.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <span className="text-xs font-bold text-muted">{game.title?.charAt(0)}</span>
                    </div>
                  )}
                </div>
              ))}
              {gameCount > 4 && (
                <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-[10px] font-bold text-muted ring-4 ring-surface z-0">
                  +{gameCount - 4}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-auto pt-6 border-t border-themed/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Explorar</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform"></i>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
