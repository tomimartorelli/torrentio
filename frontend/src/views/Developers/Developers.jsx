import React, { useState, useEffect } from 'react';
import { useDeveloperContext } from '../../context/DeveloperContext';
import { useGameContext } from '../../context/GameContext';
import { Link } from 'react-router-dom';

const Developers = () => {
  const { developers } = useDeveloperContext();
  const { games } = useGameContext();
  const [developerList, setDeveloperList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Función para calcular la cantidad de juegos por desarrollador
  const calculateGamesCount = (developerName) => {
    if (!games || games.length === 0) return 0;
    return games.filter(game => 
      game.developer && game.developer.toLowerCase() === developerName.toLowerCase()
    ).length;
  };

  useEffect(() => {
    if (developers && games) {
      // Agregar el conteo de juegos a cada desarrollador
      const developersWithGamesCount = developers.map(developer => ({
        ...developer,
        gamesCount: calculateGamesCount(developer.name)
      }));
      setDeveloperList(developersWithGamesCount);
    }
  }, [developers, games]);

  // Filtrar y ordenar desarrolladores
  const filteredAndSortedDevelopers = developerList
    .filter(developer => 
      developer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      developer.country.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'founded') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getCountryFlag = (country) => {
    const flags = {
      'Estados Unidos': '🇺🇸',
      'Japón': '🇯🇵',
      'Francia': '🇫🇷',
      'Alemania': '🇩🇪',
      'Reino Unido': '🇬🇧',
      'Canadá': '🇨🇦',
      'España': '🇪🇸',
      'Italia': '🇮🇹',
      'Polonia': '🇵🇱',
      'Suecia': '🇸🇪',
      'Noruega': '🇳🇴',
      'Finlandia': '🇫🇮',
      'Dinamarca': '🇩🇰',
      'Países Bajos': '🇳🇱',
      'Bélgica': '🇧🇪',
      'Suiza': '🇨🇭',
      'Austria': '🇦🇹',
      'República Checa': '🇨🇿',
      'Hungría': '🇭🇺',
      'Rumania': '🇷🇴',
      'Bulgaria': '🇧🇬',
      'Grecia': '🇬🇷',
      'Portugal': '🇵🇹',
      'Irlanda': '🇮🇪',
      'Islandia': '🇮🇸',
      'Luxemburgo': '🇱🇺',
      'Malta': '🇲🇹',
      'Chipre': '🇨🇾',
      'Estonia': '🇪🇪',
      'Letonia': '🇱🇻',
      'Lituania': '🇱🇹',
      'Eslovaquia': '🇸🇰',
      'Eslovenia': '🇸🇮',
      'Croacia': '🇭🇷',
      'Serbia': '🇷🇸',
      'Bosnia y Herzegovina': '🇧🇦',
      'Montenegro': '🇲🇪',
      'Albania': '🇦🇱',
      'Macedonia del Norte': '🇲🇰',
      'Kosovo': '🇽🇰',
      'Moldavia': '🇲🇩',
      'Ucrania': '🇺🇦',
      'Bielorrusia': '🇧🇾',
      'Rusia': '🇷🇺',
      'Georgia': '🇬🇪',
      'Armenia': '🇦🇲',
      'Azerbaiyán': '🇦🇿',
      'Kazajistán': '🇰🇿',
      'Uzbekistán': '🇺🇿',
      'Turkmenistán': '🇹🇲',
      'Kirguistán': '🇰🇬',
      'Tayikistán': '🇹🇯',
      'Mongolia': '🇲🇳',
      'China': '🇨🇳',
      'Corea del Sur': '🇰🇷',
      'Corea del Norte': '🇰🇵',
      'Taiwán': '🇹🇼',
      'Hong Kong': '🇭🇰',
      'Macao': '🇲🇴',
      'Singapur': '🇸🇬',
      'Malasia': '🇲🇾',
      'Indonesia': '🇮🇩',
      'Filipinas': '🇵🇭',
      'Tailandia': '🇹🇭',
      'Vietnam': '🇻🇳',
      'Laos': '🇱🇦',
      'Camboya': '🇰🇭',
      'Myanmar': '🇲🇲',
      'Bangladesh': '🇧🇩',
      'Sri Lanka': '🇱🇰',
      'Nepal': '🇳🇵',
      'Bután': '🇧🇹',
      'Maldivas': '🇲🇻',
      'India': '🇮🇳',
      'Pakistán': '🇵🇰',
      'Afganistán': '🇦🇫',
      'Irán': '🇮🇷',
      'Irak': '🇮🇶',
      'Kuwait': '🇰🇼',
      'Arabia Saudita': '🇸🇦',
      'Yemen': '🇾🇪',
      'Omán': '🇴🇲',
      'Emiratos Árabes Unidos': '🇦🇪',
      'Qatar': '🇶🇦',
      'Bahrein': '🇧🇭',
      'Israel': '🇮🇱',
      'Palestina': '🇵🇸',
      'Líbano': '🇱🇧',
      'Siria': '🇸🇾',
      'Jordania': '🇯🇴',
      'Egipto': '🇪🇬',
      'Sudán': '🇸🇩',
      'Sudán del Sur': '🇸🇸',
      'Etiopía': '🇪🇹',
      'Eritrea': '🇪🇷',
      'Yibuti': '🇩🇯',
      'Somalia': '🇸🇴',
      'Kenia': '🇰🇪',
      'Tanzania': '🇹🇿',
      'Uganda': '🇺🇬',
      'Ruanda': '🇷🇼',
      'Burundi': '🇧🇮',
      'República Democrática del Congo': '🇨🇩',
      'República del Congo': '🇨🇬',
      'Gabón': '🇬🇦',
      'Guinea Ecuatorial': '🇬🇶',
      'Camerún': '🇨🇲',
      'Nigeria': '🇳🇬',
      'Níger': '🇳🇪',
      'Chad': '🇹🇩',
      'Libia': '🇱🇾',
      'Túnez': '🇹🇳',
      'Argelia': '🇩🇿',
      'Marruecos': '🇲🇦',
      'Mauritania': '🇲🇷',
      'Senegal': '🇸🇳',
      'Gambia': '🇬🇲',
      'Guinea-Bisáu': '🇬🇼',
      'Guinea': '🇬🇳',
      'Sierra Leona': '🇸🇱',
      'Liberia': '🇱🇷',
      'Costa de Marfil': '🇨🇮',
      'Ghana': '🇬🇭',
      'Togo': '🇹🇬',
      'Benín': '🇧🇯',
      'Burkina Faso': '🇧🇫',
      'Malí': '🇲🇱',
      'Cabo Verde': '🇨🇻',
      'Santo Tomé y Príncipe': '🇸🇹',
      'Angola': '🇦🇴',
      'Namibia': '🇳🇦',
      'Botswana': '🇧🇼',
      'Zimbabue': '🇿🇼',
      'Zambia': '🇿🇲',
      'Malawi': '🇲🇼',
      'Mozambique': '🇲🇿',
      'Madagascar': '🇲🇬',
      'Comoras': '🇰🇲',
      'Seychelles': '🇸🇨',
      'Mauricio': '🇲🇺',
      'Sudáfrica': '🇿🇦',
      'Lesoto': '🇱🇸',
      'Esuatini': '🇸🇿',
      'Australia': '🇦🇺',
      'Nueva Zelanda': '🇳🇿',
      'Papúa Nueva Guinea': '🇵🇬',
      'Fiyi': '🇫🇯',
      'Vanuatu': '🇻🇺',
      'Nueva Caledonia': '🇳🇨',
      'Polinesia Francesa': '🇵🇫',
      'Samoa': '🇼🇸',
      'Tonga': '🇹🇴',
      'Kiribati': '🇰🇮',
      'Tuvalu': '🇹🇻',
      'Nauru': '🇳🇷',
      'Islas Salomón': '🇸🇧',
      'Timor Oriental': '🇹🇱',
      'Brunéi': '🇧🇳',
      'México': '🇲🇽',
      'Guatemala': '🇬🇹',
      'Belice': '🇧🇿',
      'El Salvador': '🇸🇻',
      'Honduras': '🇭🇳',
      'Nicaragua': '🇳🇮',
      'Costa Rica': '🇨🇷',
      'Panamá': '🇵🇦',
      'Colombia': '🇨🇴',
      'Venezuela': '🇻🇪',
      'Guyana': '🇬🇾',
      'Surinam': '🇸🇷',
      'Brasil': '🇧🇷',
      'Ecuador': '🇪🇨',
      'Perú': '🇵🇪',
      'Bolivia': '🇧🇴',
      'Paraguay': '🇵🇾',
      'Uruguay': '🇺🇾',
      'Argentina': '🇦🇷',
      'Chile': '🇨🇱',
      'Cuba': '🇨🇺',
      'Jamaica': '🇯🇲',
      'Haití': '🇭🇹',
      'República Dominicana': '🇩🇴',
      'Puerto Rico': '🇵🇷',
      'Bahamas': '🇧🇸',
      'Barbados': '🇧🇧',
      'Trinidad y Tobago': '🇹🇹',
      'Grenada': '🇬🇩',
      'San Vicente y las Granadinas': '🇻🇨',
      'Santa Lucía': '🇱🇨',
      'Antigua y Barbuda': '🇦🇬',
      'San Cristóbal y Nieves': '🇰🇳',
      'Dominica': '🇩🇲',
      'Antillas Holandesas': '🇧🇶',
      'Aruba': '🇦🇼',
      'Curazao': '🇨🇼',
      'San Martín': '🇸🇽',
      'San Bartolomé': '🇧🇱',
      'Guadalupe': '🇬🇵',
      'Martinica': '🇲🇶',
      'Guyana Francesa': '🇬🇫',
      'Surinam': '🇸🇷',
      'Falkland Islands': '🇫🇰',
      'Georgia del Sur': '🇬🇸',
      'Antártida': '🇦🇶'
    };
    return flags[country] || '🌍';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-primary font-neue-haas">
      {/* Header Section */}
      <div className="bg-secondary/30 border-b border-themed/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted mb-8">
            <Link to="/" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <i className="fas fa-house text-[10px]"></i>
              <span>Inicio</span>
            </Link>
            <i className="fas fa-chevron-right text-[8px] opacity-30"></i>
            <span className="text-primary flex items-center gap-1.5">
              <span>Estudios</span>
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4 tracking-tight">
                Estudios <span className="text-blue-600">Creativos</span>
              </h1>
              <p className="text-lg text-secondary leading-relaxed">
                Conoce a las mentes brillantes y los estudios que dan vida a tus historias y aventuras favoritas.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-10 border-l border-themed/50 pl-10 hidden lg:flex">
              <div>
                <div className="text-3xl font-bold text-primary">{filteredAndSortedDevelopers.length}</div>
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Estudios</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">
                  {filteredAndSortedDevelopers.reduce((acc, dev) => acc + dev.gamesCount, 0)}
                </div>
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Juegos Totales</div>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative group">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-blue-600 transition-colors text-xs"></i>
              <input
                type="text"
                placeholder="Buscar por nombre o país..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-surface border border-themed/60 rounded-2xl text-primary placeholder:text-muted focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all text-sm"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2">
              <div className="relative group min-w-[160px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-4 pr-10 py-4 bg-surface border border-themed/60 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all text-sm appearance-none"
                >
                  <option value="name">Nombre</option>
                  <option value="country">País</option>
                  <option value="founded">Fundación</option>
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-muted text-[10px] pointer-events-none"></i>
              </div>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-6 py-4 bg-surface border border-themed/60 rounded-2xl text-primary hover:bg-tertiary transition-all active:scale-95"
              >
                <i className={`fas fa-arrow-${sortOrder === 'asc' ? 'up' : 'down'}-wide-short text-blue-600`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredAndSortedDevelopers.length === 0 ? (
          <div className="text-center py-32 bg-secondary/10 rounded-[3rem] border border-dashed border-themed">
            <div className="w-20 h-20 rounded-full bg-surface border border-themed flex items-center justify-center mx-auto mb-6 shadow-sm">
              <i className="fas fa-users-slash text-2xl text-muted"></i>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">Sin resultados</h3>
            <p className="text-secondary text-sm mb-10 max-w-xs mx-auto">No encontramos estudios con esos criterios de búsqueda.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSortBy('name');
                setSortOrder('asc');
              }}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-blue-500/20"
            >
              Reiniciar búsqueda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedDevelopers.map((developer) => (
              <Link 
                key={developer._id}
                to={`/developers/developerDetails/${developer._id}`}
                className="group bg-surface border border-themed/60 p-8 rounded-[2rem] transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 flex flex-col"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <span className="text-2xl">{getCountryFlag(developer.country)}</span>
                  </div>
                  <div className="text-[10px] font-bold text-muted uppercase tracking-widest bg-secondary/50 px-3 py-1 rounded-full">
                    Est. {developer.founded ? new Date(developer.founded).getFullYear() : 'N/A'}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-blue-600 transition-colors">
                  {developer.name}
                </h3>
                <p className="text-sm text-secondary font-medium mb-6 flex items-center gap-2">
                  <i className="fas fa-location-dot text-blue-500 text-[10px]"></i>
                  {developer.country}
                </p>

                {developer.description && (
                  <p className="text-sm text-secondary line-clamp-2 leading-relaxed mb-8 opacity-80">
                    {developer.description}
                  </p>
                )}

                <div className="mt-auto pt-6 border-t border-themed/40 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest">
                    <i className="fas fa-gamepad text-blue-500 opacity-70"></i>
                    <span>{developer.gamesCount} Juegos</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Developers;
