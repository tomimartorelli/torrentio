import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDeveloperContext } from '../../context/DeveloperContext';
import { useGameContext } from '../../context/GameContext';
import GameCard from '../../components/GameCard/GameCard';

const DeveloperDetails = () => {
  const { id } = useParams();
  const { games } = useGameContext();
  const { developers } = useDeveloperContext();

  const developer = useMemo(() => {
    return developers.find((dev) => dev._id === id);
  }, [developers, id]);

  const developerGames = useMemo(() => {
    return games.filter((game) => game.developer === developer?.name);
  }, [games, developer]);

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

  const calculateAge = (foundedDate) => {
    if (!foundedDate) return 0;
    const founded = new Date(foundedDate);
    const now = new Date();
    return now.getFullYear() - founded.getFullYear();
  };

  if (!developer) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-6 font-neue-haas">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-8 rounded-[2rem] bg-secondary border border-themed/50 flex items-center justify-center shadow-sm">
            <i className="fas fa-building-circle-exclamation text-muted text-3xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-primary mb-4 tracking-tight">Estudio no encontrado</h2>
          <p className="text-secondary mb-10 text-lg leading-relaxed">El estudio creativo que buscas no se encuentra en nuestros registros actuales.</p>
          <Link to="/developers" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95">
            <i className="fas fa-arrow-left text-sm"></i>
            Volver a Estudios
          </Link>
        </div>
      </div>
    );
  }

  const age = calculateAge(developer.founded);

  return (
    <div className="min-h-screen bg-primary font-neue-haas">
      {/* Header Section */}
      <div className="bg-secondary/30 border-b border-themed/50 relative overflow-hidden">
        <div className="w-full px-6 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-12 text-[10px] font-bold uppercase tracking-widest text-muted">
              <Link to="/developers" className="hover:text-blue-600 transition-colors">Estudios</Link>
              <i className="fas fa-chevron-right text-[8px] opacity-30"></i>
              <span className="text-primary truncate">{developer.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Main Info */}
              <div className="lg:col-span-7">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-8">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2.5rem] bg-white dark:bg-blue-900/20 shadow-2xl shadow-blue-500/10 flex items-center justify-center text-blue-600 border border-themed/50">
                    <i className="fas fa-building text-4xl"></i>
                  </div>
                  <div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-4 tracking-tight leading-tight">
                      {developer.name}
                    </h1>
                    <div className="flex items-center gap-3 bg-surface/50 w-fit px-4 py-2 rounded-full border border-themed/40 shadow-sm">
                      <span className="text-2xl">{getCountryFlag(developer.country)}</span>
                      <span className="text-sm font-bold text-secondary uppercase tracking-widest">{developer.country}</span>
                    </div>
                  </div>
                </div>
                {developer.description && (
                  <p className="text-xl text-secondary leading-relaxed max-w-3xl">
                    {developer.description}
                  </p>
                )}
              </div>

              {/* Stats Grid */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface border border-themed/60 rounded-[2rem] p-8 shadow-xl shadow-blue-500/5 group hover:border-blue-500/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Fundación</h4>
                  <div className="text-lg font-bold text-primary">{formatDate(developer.founded)}</div>
                </div>

                <div className="bg-surface border border-themed/60 rounded-[2rem] p-8 shadow-xl shadow-blue-500/5 group hover:border-blue-500/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                    <i className="fas fa-hourglass-half"></i>
                  </div>
                  <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Trayectoria</h4>
                  <div className="text-lg font-bold text-primary">{age} años de éxito</div>
                </div>

                <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-600/20 sm:col-span-2 flex items-center justify-between group">
                  <div>
                    <h4 className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-2">Producción Total</h4>
                    <div className="text-3xl font-bold">{developerGames.length} Juegos Publicados</div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <i className="fas fa-gamepad text-2xl"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Abstract background element */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/5 blur-[120px] -z-0"></div>
        </div>
      </div>

      {/* Games Catalog Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-4 tracking-tight">Catálogo del Estudio</h2>
            <p className="text-lg text-secondary">Explora todas las obras maestras desarrolladas por {developer.name}.</p>
          </div>
          {developer.website && (
            <a 
              href={developer.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-surface border border-themed/60 rounded-2xl font-bold text-sm text-primary hover:bg-tertiary transition-all shadow-sm active:scale-95"
            >
              <i className="fas fa-globe text-blue-600"></i>
              Sitio Web Oficial
            </a>
          )}
        </div>

        {developerGames.length === 0 ? (
          <div className="text-center py-32 bg-secondary/10 rounded-[3rem] border border-dashed border-themed">
            <div className="w-20 h-20 rounded-full bg-surface border border-themed flex items-center justify-center mx-auto mb-6 shadow-sm text-muted">
              <i className="fas fa-box-open text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">Sin títulos registrados</h3>
            <p className="text-secondary text-sm mb-10 max-w-xs mx-auto">Actualmente no tenemos juegos listados para este desarrollador en nuestra base de datos.</p>
            <Link 
              to="/gameList"
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-all shadow-lg active:scale-95"
            >
              Explorar Catálogo General
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {developerGames.map((game) => (
              <GameCard key={game._id} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperDetails;
