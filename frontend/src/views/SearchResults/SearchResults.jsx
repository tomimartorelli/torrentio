import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useGameContext } from '../../context/GameContext';
import GameCard from '../../components/GameCard/GameCard';

const SearchResults = () => {
  const { games = [] } = useGameContext();
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTime, setSearchTime] = useState(0);
  const gamesPerPage = 12;
  const location = useLocation();

  const query = new URLSearchParams(location.search).get('search') || ''; 

  // Obtener géneros únicos para el filtro
  const uniqueGenres = [...new Set(games.map(game => game.genre))].sort();

  useEffect(() => {
    const startTime = performance.now();
    
    if (query) {
      const cleanQuery = query.trim().toLowerCase();
      setSearchTerm(cleanQuery);

      let results = games.filter(game => {
        const gameName = game.name ? game.name.toLowerCase() : '';
        const gameTitle = game.title ? game.title.toLowerCase() : '';
        const gameDeveloper = game.developer ? game.developer.toLowerCase() : '';
        const gameGenre = game.genre ? game.genre.toLowerCase() : '';

        // Búsqueda más amplia
        return gameName.includes(cleanQuery) || 
               gameTitle.includes(cleanQuery) || 
               gameDeveloper.includes(cleanQuery) ||
               gameGenre.includes(cleanQuery);
      });

      // Aplicar filtro de género si está seleccionado
      if (selectedGenre) {
        results = results.filter(game => 
          game.genre.toLowerCase() === selectedGenre.toLowerCase()
        );
      }

      // Ordenar resultados
      results.sort((a, b) => {
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

      setFilteredGames(results);
      setCurrentPage(1);
    } else {
      setFilteredGames([]);
    }

    const endTime = performance.now();
    setSearchTime(endTime - startTime);
  }, [games, query, selectedGenre, sortBy, sortOrder]);

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

  // Calcular estadísticas
  const totalGames = filteredGames.length;
  const averageSize = totalGames > 0 
    ? Math.round(filteredGames.reduce((acc, game) => acc + (game.weight || 0), 0) / totalGames)
    : 0;
  const averageYear = totalGames > 0
    ? Math.round(filteredGames.reduce((acc, game) => acc + (game.releaseYear || 0), 0) / totalGames)
    : 0;
  const genreCount = totalGames > 0
    ? [...new Set(filteredGames.map(game => game.genre))].length
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Optimizado para móviles */}
      <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-b border-purple-200">
        <div className="w-full px-4 py-4 sm:py-8">
          {/* Breadcrumb - Más compacto en móviles */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-purple-600 transition-colors flex items-center gap-1">
              <i className="fas fa-home text-xs"></i>
              <span className="hidden sm:inline">Home</span>
            </Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <span className="text-gray-700 flex items-center gap-1">
              <i className="fas fa-search text-xs"></i>
              <span className="hidden sm:inline">Búsqueda</span>
            </span>
          </div>

          {/* Search Header - Optimizado para móviles */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg">
                <i className="fas fa-search"></i>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1">
                  Resultados de Búsqueda
                </h1>
                <p className="text-sm sm:text-lg text-gray-600">
                  {query ? `Buscando: "${query}"` : 'Ingresa un término de búsqueda'}
                </p>
              </div>
            </div>
          </div>

          {/* Search Stats - Optimizado para móviles */}
          {query && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-lg">
                <div className="text-xl sm:text-3xl font-bold text-gray-800">{totalGames}</div>
                <div className="text-xs sm:text-sm text-gray-600">Resultados</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-lg">
                <div className="text-xl sm:text-3xl font-bold text-gray-800">{averageSize}</div>
                <div className="text-xs sm:text-sm text-gray-600">Tamaño Promedio (GB)</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-lg">
                <div className="text-xl sm:text-3xl font-bold text-gray-800">{averageYear}</div>
                <div className="text-xs sm:text-sm text-gray-600">Año Promedio</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-lg">
                <div className="text-xl sm:text-3xl font-bold text-gray-800">{genreCount}</div>
                <div className="text-xs sm:text-sm text-gray-600">Géneros Encontrados</div>
              </div>
            </div>
          )}

          {/* Search Performance - Optimizado para móviles */}
          {query && searchTime > 0 && (
            <div className="text-center mb-4 sm:mb-6">
              <p className="text-gray-500 text-xs sm:text-sm">
                <i className="fas fa-clock mr-2"></i>
                Búsqueda completada en {searchTime.toFixed(2)}ms
              </p>
            </div>
          )}

          {/* Filtros - Optimizado para móviles */}
          {query && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Género */}
              <div>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="" className="bg-white text-gray-800">Todos los géneros</option>
                  {uniqueGenres.map(genre => (
                    <option key={genre} value={genre} className="bg-white text-gray-800">
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordenar por */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="title" className="bg-white text-gray-800">Título</option>
                  <option value="developer" className="bg-white text-gray-800">Desarrollador</option>
                  <option value="releaseYear" className="bg-white text-gray-800">Año</option>
                  <option value="weight" className="bg-white text-gray-800">Tamaño</option>
                  <option value="genre" className="bg-white text-gray-800">Género</option>
                </select>
              </div>

              {/* Orden */}
              <div>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 text-sm"
                >
                  <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'} mr-2`}></i>
                  {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
                </button>
              </div>

              {/* Limpiar filtros */}
              <div>
                <button
                  onClick={() => {
                    setSelectedGenre('');
                    setSortBy('title');
                    setSortOrder('asc');
                  }}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 text-sm"
                >
                  <i className="fas fa-times mr-2"></i>
                  Limpiar Filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenido Principal - Optimizado para móviles */}
      <div className="w-full px-4 py-4 sm:py-8">
        {!query ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No hay término de búsqueda</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Ingresa un término en la barra de búsqueda para encontrar juegos</p>
            <Link 
              to="/gameList"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 text-sm"
            >
              Ver Todos los Juegos
            </Link>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-6xl mb-4">😕</div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No se encontraron resultados</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              No hay juegos que coincidan con "{query}"
              {selectedGenre && ` en el género "${selectedGenre}"`}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => {
                  setSelectedGenre('');
                  setSortBy('title');
                  setSortOrder('asc');
                }}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 text-sm"
              >
                Limpiar Filtros
              </button>
              <Link 
                to="/gameList"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 text-sm"
              >
                Ver Todos los Juegos
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Resultados - Optimizado para móviles */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-2">
                Mostrando {currentGames.length} de {totalGames} resultados
              </h2>
              {selectedGenre && (
                <p className="text-gray-600 text-sm">
                  Filtrado por género: <span className="text-purple-600 font-semibold">{selectedGenre}</span>
                </p>
              )}
            </div>

            {/* Grid de Juegos - Optimizado para móviles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {currentGames.map((game) => (
                <div
                  key={game._id}
                  className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <GameCard game={game} />
                </div>
              ))}
            </div>

            {/* Paginación - Optimizada para móviles */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                {/* Botón Anterior */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                {/* Números de Página */}
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-2 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                      currentPage === pageNumber
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                {/* Puntos suspensivos */}
                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                  <>
                    <span className="px-2 sm:px-4 py-2 text-gray-500">...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="px-2 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300 text-sm"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                {/* Botón Siguiente */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
