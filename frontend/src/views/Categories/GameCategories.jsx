import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGameContext } from '../../context/GameContext';
import GameCard from '../../components/GameCard/GameCard';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import LoadingState from '../../components/LoadingState/LoadingState';
import ErrorState from '../../components/ErrorState/ErrorState';

const GameCategories = () => {
  const { genre } = useParams();
  const { games, loading: contextLoading, error: contextError } = useGameContext();
  
  // Decodificar el género de la URL
  const decodedGenre = genre ? decodeURIComponent(genre) : null;
  
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 12;

  // Información completa de categorías
  const categoryInfo = {
    'Acción': {
      icon: 'fa-solid fa-fire',
      color: 'bg-red-500',
      description: 'Juegos llenos de adrenalina con combate dinámico, secuencias de acción intensa y ritmo acelerado.',
      keywords: ['combate', 'acción', 'velocidad', 'adrenalina']
    },
    'Aventura': {
      icon: 'fa-solid fa-compass',
      color: 'bg-blue-500',
      description: 'Explora mundos fascinantes, resuelve enigmas y vive historias épicas llenas de descubrimientos.',
      keywords: ['exploración', 'historia', 'narrativa', 'mundos']
    },
    'RPG': {
      icon: 'fa-solid fa-dice-d20',
      color: 'bg-purple-600',
      description: 'Desarrolla tu personaje, toma decisiones que importan y sumérgete en mundos de fantasía profundos.',
      keywords: ['personajes', 'decisiones', 'fantasía', 'desarrollo']
    },
    'Deportes': {
      icon: 'fa-solid fa-futbol',
      color: 'bg-emerald-600',
      description: 'Experimenta la emoción del deporte con simulaciones realistas y competencias emocionantes.',
      keywords: ['competencia', 'realismo', 'equipos', 'torneos']
    },
    'Horror': {
      icon: 'fa-solid fa-ghost',
      color: 'bg-zinc-800',
      description: 'Enfrenta tus miedos más profundos en experiencias terroríficas que te mantendrán al borde del asiento.',
      keywords: ['terror', 'suspenso', 'miedo', 'supervivencia']
    },
    'FPS': {
      icon: 'fa-solid fa-crosshairs',
      color: 'bg-orange-500',
      description: 'Acción en primera persona con combate táctico, puntería precisa y batallas multijugador épicas.',
      keywords: ['primera persona', 'multijugador', 'táctico', 'puntería']
    },
    'Roguelike': {
      icon: 'fa-solid fa-dice',
      color: 'bg-indigo-600',
      description: 'Experiencias únicas en cada partida con generación procedural y desafíos constantemente renovados.',
      keywords: ['procedural', 'aleatorio', 'desafío', 'único']
    },
    'Souls': {
      icon: 'fa-solid fa-skull',
      color: 'bg-zinc-900',
      description: 'Juegos desafiantes que prueban tu habilidad y paciencia con combate preciso y mundos oscuros.',
      keywords: ['desafío', 'precisión', 'oscuro', 'habilidad']
    },
    'Sandbox': {
      icon: 'fa-solid fa-hammer',
      color: 'bg-amber-500',
      description: 'Libera tu creatividad construyendo, modificando y creando en mundos completamente moldeables.',
      keywords: ['creatividad', 'construcción', 'libertad', 'creación']
    },
    'Survival': {
      icon: 'fa-solid fa-shield-halved',
      color: 'bg-teal-600',
      description: 'Sobrevive en entornos hostiles gestionando recursos, construyendo refugios y enfrentando peligros.',
      keywords: ['supervivencia', 'recursos', 'hostil', 'refugio']
    }
  };

  // Función para obtener estadísticas de categorías
  const getCategoryStats = () => {
    if (!games || games.length === 0) return {};
    
    const stats = {};
    
    Object.keys(categoryInfo).forEach(category => {
      const categoryGames = games.filter(game => 
        game.genre && game.genre.toLowerCase() === category.toLowerCase()
      );
      
      stats[category] = {
        count: categoryGames.length,
        games: categoryGames.slice(0, 4), // Solo los primeros 4 para preview
        avgSize: categoryGames.length > 0 ? 
          Math.round(categoryGames.reduce((acc, game) => acc + (parseFloat(game.weight) || 0), 0) / categoryGames.length) : 0,
        avgYear: categoryGames.length > 0 ?
          Math.round(categoryGames.reduce((acc, game) => acc + (parseInt(game.releaseYear) || 2020), 0) / categoryGames.length) : 2024
      };
    });
    
    return stats;
  };

  const categoryStats = getCategoryStats();

  useEffect(() => {
    const filterGamesByGenre = () => {
      let filtered = games || [];
      
      if (decodedGenre) {
        filtered = filtered.filter((game) => 
          game.genre && game.genre.toLowerCase() === decodedGenre.toLowerCase()
        );
      }

      // Filtrar por búsqueda
      if (searchTerm) {
        filtered = filtered.filter(game =>
          game.title && game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.developer && game.developer.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Ordenar
      filtered.sort((a, b) => {
        let aValue = a[sortBy] || '';
        let bValue = b[sortBy] || '';

        if (sortBy === 'title' || sortBy === 'developer') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      setFilteredGames(filtered);
      setCurrentPage(1);
    };

    filterGamesByGenre();
  }, [genre, games, searchTerm, sortBy, sortOrder]);



  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  // Mostrar estado de carga
  if (contextLoading) {
    return (
      <LoadingState 
        variant="default"
        message="Cargando juegos de la categoría..."
        size="large"
      />
    );
  }

  // Mostrar estado de error
  if (contextError) {
    return (
      <ErrorState 
        error={contextError}
        variant="default"
      />
    );
  }

  // Renderizar vista de categorías o vista de juegos específicos
  if (!decodedGenre) {
    // Vista de todas las categorías
    return (
      <div className="min-h-screen bg-primary font-neue-haas">
        {/* Header de Categorías */}
        <div className="bg-secondary/30 border-b border-themed/50">
          <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted mb-8">
              <Link to="/" className="hover:text-purple-600 transition-colors flex items-center gap-1.5">
                <i className="fas fa-house text-[10px]"></i>
                <span>Inicio</span>
              </Link>
              <i className="fas fa-chevron-right text-[8px] opacity-30"></i>
              <span className="text-primary flex items-center gap-1.5">
                <span>Géneros</span>
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4 tracking-tight">
                  Explorar por <span className="text-purple-600">Géneros</span>
                </h1>
                <p className="text-lg text-secondary leading-relaxed">
                  Descubre experiencias curadas a través de nuestras diversas categorías de videojuegos.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-10 border-l border-themed/50 pl-10 hidden lg:flex">
                <div>
                  <div className="text-3xl font-bold text-primary">{Object.keys(categoryInfo).length}</div>
                  <div className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Géneros</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">{games?.length || 0}</div>
                  <div className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Catálogo</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Categorías */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {contextLoading ? (
            <div className="flex justify-center py-32">
              <div className="w-12 h-12 border-4 border-purple-600/20 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          ) : contextError ? (
            <ErrorState error={contextError} variant="default" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Object.entries(categoryInfo).map(([category, info]) => {
                const stats = categoryStats[category] || { count: 0, games: [] };
                return (
                  <CategoryCard
                    key={category}
                    category={category}
                    gameCount={stats.count}
                    description={info.description}
                    color={info.color}
                    icon={info.icon}
                    featuredGames={stats.games}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vista de juegos de una categoría específica
  const currentCategory = categoryInfo[decodedGenre] || {};
  const genreTitle = decodedGenre.charAt(0).toUpperCase() + decodedGenre.slice(1);

  return (
    <div className="min-h-screen bg-primary font-neue-haas">
      {/* Header Section */}
      <div className="bg-secondary/30 border-b border-themed/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted mb-8">
            <Link to="/" className="hover:text-purple-600 transition-colors flex items-center gap-1.5">
              <i className="fas fa-house text-[10px]"></i>
              <span>Inicio</span>
            </Link>
            <i className="fas fa-chevron-right text-[8px] opacity-30"></i>
            <Link to="/categories" className="hover:text-purple-600 transition-colors">
              <span>Géneros</span>
            </Link>
            <i className="fas fa-chevron-right text-[8px] opacity-30"></i>
            <span className="text-primary flex items-center gap-1.5">
              <span>{genreTitle}</span>
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${currentCategory.color || 'bg-purple-600'}`}>
                  <i className={currentCategory.icon || 'fa-solid fa-gamepad'}></i>
                </div>
                <h1 className="text-4xl font-bold text-primary tracking-tight">
                  {genreTitle}
                </h1>
              </div>
              <p className="text-lg text-secondary leading-relaxed">
                {currentCategory.description || `Explora nuestra selección de títulos de ${genreTitle.toLowerCase()}.`}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-10 border-l border-themed/50 pl-10 hidden lg:flex">
              <div>
                <div className="text-3xl font-bold text-primary">{filteredGames.length}</div>
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Títulos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">
                  {filteredGames.length > 0 ? Math.round(filteredGames.reduce((acc, game) => acc + (parseFloat(game.weight) || 0), 0) / filteredGames.length) : 0}
                </div>
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">GB Promedio</div>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="mt-12 flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative group">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-purple-600 transition-colors text-xs"></i>
              <input
                type="text"
                placeholder={`Buscar en ${genreTitle}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-surface border border-themed/60 rounded-2xl text-primary placeholder:text-muted focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2">
              <div className="relative group min-w-[160px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-4 pr-10 py-4 bg-surface border border-themed/60 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm appearance-none"
                >
                  <option value="title">Título</option>
                  <option value="developer">Estudio</option>
                  <option value="releaseYear">Año</option>
                  <option value="weight">Tamaño</option>
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-muted text-[10px] pointer-events-none"></i>
              </div>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-6 py-4 bg-surface border border-themed/60 rounded-2xl text-primary hover:bg-tertiary transition-all active:scale-95"
              >
                <i className={`fas fa-arrow-${sortOrder === 'asc' ? 'up' : 'down'}-wide-short text-purple-600`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredGames.length === 0 ? (
          <div className="text-center py-32 bg-secondary/10 rounded-[3rem] border border-dashed border-themed">
            <div className="w-20 h-20 rounded-full bg-surface border border-themed flex items-center justify-center mx-auto mb-6 shadow-sm">
              <i className={`${currentCategory.icon || 'fa-solid fa-gamepad'} text-2xl text-muted`}></i>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">No se encontraron juegos</h3>
            <p className="text-secondary text-sm mb-10 max-w-xs mx-auto">No hay títulos en {genreTitle} que coincidan con tu búsqueda.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('title');
                  setSortOrder('asc');
                }}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-all shadow-lg"
              >
                Reiniciar filtros
              </button>
              <Link 
                to="/gameList"
                className="px-8 py-3 bg-surface border border-themed text-primary hover:bg-tertiary rounded-full font-bold transition-all"
              >
                Ver todo el catálogo
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
              {currentGames.map((game) => (
                <GameCard key={game._id} game={game} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 border-t border-themed pt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl border border-themed hover:bg-tertiary disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <i className="fas fa-chevron-left text-xs"></i>
                </button>

                <div className="flex items-center gap-2">
                  {pageNumbers.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl font-bold text-sm transition-all ${
                        currentPage === pageNumber
                          ? 'bg-purple-600 text-white shadow-xl'
                          : 'border border-themed hover:bg-tertiary text-secondary'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl border border-themed hover:bg-tertiary disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <i className="fas fa-chevron-right text-xs"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GameCategories;
