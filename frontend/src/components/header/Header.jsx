import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, changeTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <>
      <header className="bg-primary text-primary sticky top-0 z-50 border-b border-themed/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-8 relative">
              <div className={`${isMobile ? 'w-36 h-16' : 'w-56 h-20'} relative flex items-center`}>
                <Link to="/" className="absolute left-0 top-1/2 -translate-y-1/2 transition-all hover:scale-105 active:scale-95 z-10">
                  <img 
                    src="/images/TORRENTIO4.png" 
                    alt="Torrentio Logo" 
                    className={`${isMobile ? 'h-24' : 'h-36'} w-auto object-contain drop-shadow-md`}
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {[
                  { to: '/gameList', label: 'Explorar' },
                  { to: '/developers', label: 'Estudios' },
                  { to: '/categories', label: 'Géneros' },
                  { to: '/contact', label: 'Soporte' }
                ].map((link) => (
                  <Link 
                    key={link.to}
                    to={link.to} 
                    className="px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-all rounded-full hover:bg-tertiary/50"
                  >
                    {link.label}
                  </Link>
                ))}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-all rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    Admin Panel
                  </Link>
                )}
              </nav>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-3">
              {/* Search - Desktop */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center relative group">
                <input
                  type="text"
                  placeholder="Buscar en Torrentio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 lg:w-64 px-4 py-2 pl-10 bg-tertiary/40 border border-transparent rounded-full focus:bg-surface focus:border-purple-500/30 focus:ring-4 focus:ring-purple-500/5 outline-none transition-all text-sm placeholder:text-muted"
                />
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-purple-500 transition-colors text-xs"></i>
              </form>

              {/* Theme Toggle */}
              <button
                onClick={() => changeTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2.5 rounded-full hover:bg-tertiary transition-all text-secondary hover:text-primary active:scale-90"
                title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              >
                <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'} text-sm`}></i>
              </button>

              <div className="h-6 w-px bg-themed/50 mx-1 hidden sm:block"></div>

              {/* User Section */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-tertiary transition-all border border-transparent hover:border-themed">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-sm">
                      <span className="text-[10px] font-bold text-white uppercase">{user.name.substring(0, 2)}</span>
                    </div>
                    <span className="hidden sm:block text-sm font-semibold text-secondary group-hover:text-primary transition-colors">{user.name}</span>
                    <i className="fas fa-chevron-down text-[10px] text-muted group-hover:text-primary transition-colors"></i>
                  </button>
                  
                  <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-themed rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right scale-95 group-hover:scale-100 p-1.5">
                    <div className="px-3 py-2 border-b border-themed/50 mb-1">
                      <p className="text-xs font-medium text-muted">Cuenta</p>
                      <p className="text-sm font-semibold truncate">{user.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-secondary hover:bg-tertiary rounded-xl transition-all hover:text-primary">
                      <i className="fas fa-user-circle text-lg opacity-70"></i>
                      <span>Mi Perfil</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                    >
                      <i className="fas fa-power-off text-lg opacity-70"></i>
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="hidden sm:block px-5 py-2 text-sm font-semibold text-secondary hover:text-primary transition-colors">
                    Ingresar
                  </Link>
                  <Link to="/register" className="px-5 py-2 bg-primary text-inverse hover:opacity-90 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95">
                    Unirse
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-full hover:bg-tertiary transition-all text-secondary"
              >
                <i className="fas fa-align-right text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar - Minimalist Design */}
      <div 
        className={`fixed inset-0 z-[9999] lg:hidden transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        {/* Sidebar Content */}
        <div className={`absolute right-0 top-0 h-screen w-[320px] bg-primary shadow-xl transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-themed/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary border border-themed flex items-center justify-center">
                <i className="fas fa-bars text-primary text-sm"></i>
              </div>
              <div>
                <span className="block text-sm font-medium text-primary">Menú</span>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-primary hover:bg-tertiary transition-colors"
            >
              <i className="fas fa-times text-sm"></i>
            </button>
          </div>

          {/* Content - No Scroll */}
          <div className="flex-1 flex flex-col p-6">
            {/* Search */}
            <div className="mb-6">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-tertiary/20 border border-themed/30 rounded-lg text-primary placeholder:text-muted focus:outline-none focus:border-themed text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors">
                  <i className="fas fa-search text-xs"></i>
                </button>
              </form>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 mb-6">
              {[
                { to: '/gameList', label: 'Juegos' },
                { to: '/developers', label: 'Estudios' },
                { to: '/categories', label: 'Géneros' },
                { to: '/contact', label: 'Soporte' }
              ].map((link) => (
                <Link 
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-primary hover:bg-tertiary/20 transition-colors text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Admin Section */}
            {user?.role === 'admin' && (
              <div className="mb-6">
                <Link 
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-purple-600 hover:bg-purple-600/10 transition-colors text-sm font-medium"
                >
                  Panel de Control
                </Link>
              </div>
            )}

            {/* User Section */}
            <div className="mt-auto">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-tertiary/10 rounded-lg">
                    <div className="w-8 h-8 bg-primary border border-themed rounded-full flex items-center justify-center text-primary text-xs font-medium">
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary truncate">{user.name}</p>
                      <p className="text-xs text-muted">{user.role}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-3 py-2 bg-tertiary/20 text-primary rounded-lg text-center text-xs font-medium hover:bg-tertiary/30 transition-colors"
                    >
                      Perfil
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg text-center text-xs font-medium hover:bg-red-500/20 transition-colors"
                    >
                      Salir
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link 
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 bg-primary text-inverse rounded-lg text-center text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Crear Cuenta
                  </Link>
                  <Link 
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 border border-themed text-primary rounded-lg text-center text-sm font-medium hover:bg-tertiary transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
