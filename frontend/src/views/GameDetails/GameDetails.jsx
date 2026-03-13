import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGameContext } from '../../context/GameContext';
import OptimizedImage from '../../components/OptimizedImage/OptimizedImage';

const GameDetails = () => {
  const { id } = useParams();
  const { games } = useGameContext();
  const [gameDetails, setGameDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const selectedGame = games.find(game => game._id === id);
    if (selectedGame) {
      setGameDetails(selectedGame);
    }
  }, [id, games]);

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
      'RPG': 'fas fa-sword',
      'Estrategia': 'fas fa-chess',
      'Deportes': 'fas fa-futbol',
      'Carreras': 'fas fa-car',
      'Simulación': 'fas fa-cog',
      'Terror': 'fas fa-ghost',
      'Plataformas': 'fas fa-gamepad',
      'Lucha': 'fas fa-fist-raised'
    };
    return icons[genre] || 'fas fa-gamepad';
  };

  if (!gameDetails) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-6 font-neue-haas">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-8 rounded-[2rem] bg-secondary border border-themed/50 flex items-center justify-center shadow-sm">
            <i className="fas fa-ghost text-muted text-3xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-primary mb-4 tracking-tight">Juego no encontrado</h2>
          <p className="text-secondary mb-10 text-lg leading-relaxed">El título que buscas no se encuentra en nuestro catálogo actual o ha sido removido.</p>
          <Link to="/gameList" className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-purple-500/20 active:scale-95">
            <i className="fas fa-arrow-left text-sm"></i>
            Volver a la Biblioteca
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary font-neue-haas">
      {/* Hero Section */}
      <div className="relative h-[60vh] sm:h-[75vh] min-h-[500px] overflow-hidden">
        {/* Background Image with Parallax-like effect */}
        {gameDetails.image && (
          <div className="absolute inset-0">
            <OptimizedImage
              src={`http://localhost:5000/${gameDetails.image}`}
              alt={gameDetails.title}
              className="w-full h-full object-cover scale-105"
              fallback="/images/placeholder-game.jpg"
            />
            {/* Minimalist Overlays */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent"></div>
          </div>
        )}
        
        {/* Content Overlay */}
        <div className="relative h-full z-10 flex flex-col justify-end">
          <div className="max-w-7xl mx-auto w-full px-6 pb-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-10 text-[10px] font-bold uppercase tracking-widest text-white/70">
              <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
              <i className="fas fa-chevron-right text-[8px] opacity-30"></i>
              <Link to="/gameList" className="hover:text-white transition-colors">Biblioteca</Link>
              <i className="fas fa-chevron-right text-[8px] opacity-30"></i>
              <span className="text-white truncate">{gameDetails.title}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
              {/* Left Side: Basic Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className={`${getGenreColor(gameDetails.genre)} text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-black/20`}>
                    {gameDetails.genre}
                  </div>
                  <div className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {gameDetails.releaseYear}
                  </div>
                  {gameDetails.rating && (
                    <div className="flex items-center gap-1.5 bg-yellow-500/90 text-black px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      <i className="fas fa-star"></i>
                      {gameDetails.rating}
                    </div>
                  )}
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
                  {gameDetails.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-8 text-white/80 text-sm font-medium">
                  <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                      <i className="fas fa-users text-xs"></i>
                    </div>
                    <span>{gameDetails.developer}</span>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                      <i className="fas fa-hdd text-xs"></i>
                    </div>
                    <span>{gameDetails.weight || 'N/A'} GB</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Primary Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 min-w-[280px]">
                <a
                  href={gameDetails.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 bg-white text-black hover:bg-purple-600 hover:text-white px-8 py-5 rounded-2xl font-bold text-base transition-all duration-300 shadow-2xl active:scale-95 group"
                >
                  <i className="fas fa-download text-lg group-hover:animate-bounce"></i>
                  Descargar Ahora
                </a>
                
                {gameDetails.youtubeUrl && (
                  <a
                    href={gameDetails.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-8 py-5 rounded-2xl font-bold text-base transition-all duration-300 active:scale-95"
                  >
                    <i className="fab fa-youtube text-lg"></i>
                    Ver Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Main Info Area */}
          <div className="lg:col-span-8 space-y-16">
            {/* Tabs Navigation */}
            <div className="flex gap-10 border-b border-themed/40">
              {[
                { id: 'description', label: 'Descripción', icon: 'fas fa-align-left' },
                { id: 'requirements', label: 'Requerimientos', icon: 'fas fa-microchip' },
                { id: 'details', label: 'Ficha Técnica', icon: 'fas fa-list-check' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-6 text-xs font-bold uppercase tracking-widest transition-all relative ${
                    activeTab === tab.id ? 'text-purple-600' : 'text-muted hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <i className={`${tab.icon} opacity-70`}></i>
                    {tab.label}
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[300px]">
              {activeTab === 'description' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="text-xl text-secondary leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                    {gameDetails.description || 'No hay una descripción detallada para este título.'}
                  </p>
                </div>
              )}

              {activeTab === 'requirements' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid sm:grid-cols-2 gap-6">
                  {gameDetails.requirements ? (
                    <>
                      <div className="p-8 bg-surface rounded-[2rem] border border-themed/50">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                          <i className="fas fa-microchip"></i>
                        </div>
                        <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Procesador</h4>
                        <p className="text-lg font-bold text-primary">{gameDetails.requirements.cpu || 'N/A'}</p>
                      </div>
                      <div className="p-8 bg-surface rounded-[2rem] border border-themed/50">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                          <i className="fas fa-tv"></i>
                        </div>
                        <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Gráficos</h4>
                        <p className="text-lg font-bold text-primary">{gameDetails.requirements.gpu || 'N/A'}</p>
                      </div>
                      <div className="p-8 bg-surface rounded-[2rem] border border-themed/50">
                        <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center mb-6 text-green-600">
                          <i className="fas fa-memory"></i>
                        </div>
                        <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Memoria RAM</h4>
                        <p className="text-lg font-bold text-primary">{gameDetails.requirements.ram || 'N/A'}</p>
                      </div>
                      <div className="p-8 bg-surface rounded-[2rem] border border-themed/50">
                        <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mb-6 text-orange-600">
                          <i className="fas fa-hdd"></i>
                        </div>
                        <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Espacio</h4>
                        <p className="text-lg font-bold text-primary">{gameDetails.weight || 'N/A'} GB</p>
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2 py-10 text-center text-secondary">Información no disponible.</div>
                  )}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid gap-4">
                  {[
                    { label: 'Título Original', value: gameDetails.title, icon: 'fa-tag' },
                    { label: 'Estudio Creativo', value: gameDetails.developer, icon: 'fa-users' },
                    { label: 'Lanzamiento', value: gameDetails.releaseYear, icon: 'fa-calendar' },
                    { label: 'Género Principal', value: gameDetails.genre, icon: 'fa-gamepad' },
                    { label: 'Calificación Media', value: gameDetails.rating || 'Pendiente', icon: 'fa-star' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 bg-surface rounded-2xl border border-themed/40 group hover:border-purple-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <i className={`fas ${item.icon} text-muted group-hover:text-purple-600 transition-colors`}></i>
                        <span className="text-sm font-bold text-muted uppercase tracking-widest">{item.label}</span>
                      </div>
                      <span className="text-lg font-bold text-primary">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area: Related Content */}
          <div className="lg:col-span-4 space-y-12">
            <div>
              <h3 className="text-xl font-bold text-primary mb-8 tracking-tight flex items-center gap-3">
                <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
                Títulos Relacionados
              </h3>
              <div className="space-y-6">
                {games
                  .filter(game => game.genre === gameDetails.genre && game._id !== gameDetails._id)
                  .slice(0, 3)
                  .map((game) => (
                    <Link
                      key={game._id}
                      to={`/gameList/gameDetails/${game._id}`}
                      className="group flex gap-4 p-3 rounded-2xl bg-secondary/50 hover:bg-tertiary transition-all"
                    >
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={`http://localhost:5000/${game.image}`}
                          alt={game.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { e.target.src = '/images/placeholder-game.jpg'; }}
                        />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <h4 className="font-bold text-primary truncate group-hover:text-purple-600 transition-colors">{game.title}</h4>
                        <p className="text-xs text-secondary mt-1 truncate">{game.developer}</p>
                        <div className="mt-2 text-[10px] font-bold text-purple-600 uppercase tracking-widest">{game.genre}</div>
                      </div>
                    </Link>
                  ))}
                {games.filter(game => game.genre === gameDetails.genre && game._id !== gameDetails._id).length === 0 && (
                  <div className="p-8 text-center bg-secondary/30 rounded-[2rem] border border-dashed border-themed">
                    <p className="text-xs font-bold text-muted uppercase tracking-widest">No hay títulos similares</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mini Community Promo */}
            <div className="bg-surface border border-themed/60 p-8 rounded-[2.5rem] shadow-xl shadow-purple-500/5">
              <h4 className="text-lg font-bold text-primary mb-4">¿Te gustó este juego?</h4>
              <p className="text-sm text-secondary leading-relaxed mb-6">Únete a nuestra comunidad para compartir reseñas y descubrir secretos de {gameDetails.title}.</p>
              <button className="w-full py-3 bg-tertiary hover:bg-purple-600 hover:text-white rounded-xl font-bold text-sm transition-all active:scale-95">
                Unirse a la charla
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
