import React, { useEffect, useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import GameCard from '../../components/GameCard/GameCard';
import LoadingState from '../../components/LoadingState/LoadingState';
import ErrorState from '../../components/ErrorState/ErrorState';
import { useDataLoading } from '../../hooks/useLoadingState';
import { Link } from 'react-router-dom'; // Added Link import

const GameList = () => {
  const { games, loading: contextLoading, error: contextError } = useGameContext();
  const [filteredGames, setFilteredGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const gamesPerPage = 25;

  const genres = ['Todos', 'Acción', 'Aventura', 'RPG', 'Deportes', 'Horror', 'FPS', 'Roguelike', 'Souls', 'Sandbox', 'Survival'];

  // Hook personalizado para manejar la carga de datos
  const { loading: dataLoading, error: dataError, refetch } = useDataLoading(
    async () => {
      // Simular un pequeño delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 500));
      return games;
    },
    [games]
  );

  useEffect(() => {
    let filtered = games;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.developer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por género
    if (selectedGenre !== 'Todos') {
      filtered = filtered.filter(game => game.genre === selectedGenre);
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

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
    setCurrentPage(1); // Reset a la primera página cuando cambian los filtros
  }, [games, searchTerm, selectedGenre, sortBy, sortOrder]);

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

  // Estados de carga y error
  const isLoading = contextLoading || dataLoading;
  const hasError = contextError || dataError;

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <LoadingState 
        variant="default"
        message="Cargando biblioteca de juegos..."
        size="large"
      />
    );
  }

  // Mostrar estado de error
  if (hasError) {
    return (
      <ErrorState 
        error={hasError}
        onRetry={refetch}
        variant="default"
      />
    );
  }

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
            <span className="text-primary flex items-center gap-1.5">
              <span>Biblioteca</span>
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4 tracking-tight">
                Biblioteca de <span className="text-purple-600">Juegos</span>
              </h1>
              <p className="text-lg text-secondary leading-relaxed">
                Explora nuestra colección curada de experiencias digitales, filtrada por los mejores estudios y géneros.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-10 border-l border-themed/50 pl-10 hidden lg:flex">
              <div>
                <div className="text-3xl font-bold text-primary">{filteredGames.length}</div>
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Resultados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">
                  {filteredGames.length > 0 ? Math.round(filteredGames.reduce((acc, game) => acc + (game.weight || 0), 0) / filteredGames.length) : 0}
                </div>
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">GB Promedio</div>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="mt-12 flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative group">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-purple-600 transition-colors text-xs"></i>
              <input
                type="text"
                placeholder="Buscar por título o desarrollador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-surface border border-themed/60 rounded-2xl text-primary placeholder:text-muted focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm"
              />
            </div>

            {/* Genre Select */}
            <div className="lg:w-64 relative group">
              <i className="fas fa-filter absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-purple-600 transition-colors text-xs"></i>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-surface border border-themed/60 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm appearance-none"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre === 'Todos' ? 'Todos los géneros' : genre}
                  </option>
                ))}
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-muted text-[10px] pointer-events-none"></i>
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2">
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-4 pr-10 py-4 bg-surface border border-themed/60 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm appearance-none min-w-[140px]"
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
              <i className="fas fa-magnifying-glass text-2xl text-muted"></i>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">No hay coincidencias</h3>
            <p className="text-secondary text-sm mb-10 max-w-xs mx-auto">Prueba ajustando tus filtros o términos de búsqueda.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('Todos');
                setSortBy('title');
                setSortOrder('asc');
              }}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-purple-500/20"
            >
              Reiniciar filtros
            </button>
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
                          ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/20'
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

export default GameList;

