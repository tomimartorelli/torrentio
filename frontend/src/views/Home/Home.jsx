import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStats } from '../../hooks/useAppStats';
import { useGameContext } from '../../context/GameContext';
import axios from 'axios';

const Home = () => {
  const { formattedStats, loading: statsLoading } = useAppStats();
  const { games, loading: gamesLoading } = useGameContext();

  return (
    <div className="min-h-screen bg-primary font-neue-haas">
      {/* Hero Section - Minimalist with Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-banner.jpg"
            alt="Gaming Universe"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-primary/30"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-light tracking-tight text-black dark:text-white mb-8 drop-shadow-md">
            PLAY <br className="hidden sm:block"/> 
            <span className="font-light italic">BEYOND</span> <br className="hidden sm:block"/> 
            LIMITS
          </h1>

          <p className="text-lg sm:text-xl text-gray-900 dark:text-gray-100 mb-16 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
            La curaduría de software más exclusiva del mundo. <br className="hidden sm:block"/>
            <span className="text-gray-800 dark:text-gray-200">Velocidad, minimalismo y seguridad absoluta.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/gameList"
              className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-none text-sm font-medium tracking-wide hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Explorar Catálogo
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-none text-sm font-medium tracking-wide hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Únete a Nosotros
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Games - Most Used */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-sm font-medium tracking-wider text-muted mb-4">
              Destacados
            </h2>
            <h3 className="text-4xl md:text-5xl font-light tracking-tight text-primary">
              Los Más Usados
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {gamesLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-tertiary/20 dark:bg-tertiary/10 animate-pulse"></div>
              ))
            ) : games && games.length > 0 ? (
              // Ordenar por más usados (simulado con los primeros 4 juegos)
              games.slice(0, 4).map((game) => (
                <Link 
                  key={game._id} 
                  to={`/gameList/gameDetails/${game._id}`}
                  className="group block aspect-[3/4] overflow-hidden border border-themed/40 hover:border-themed transition-colors"
                >
                  <div className="relative h-full">
                    <img 
                      src={game.image ? `http://localhost:5000/${game.image}` : `https://via.placeholder.com/400x600/1a1a1a/ffffff?text=${encodeURIComponent(game.title)}`} 
                      alt={game.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x600/1a1a1a/ffffff?text=${encodeURIComponent(game.title)}`;
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-primary/90 dark:from-primary/95 to-transparent">
                      <span className="text-xs text-muted tracking-wide uppercase block mb-2">
                        {game.genre || 'Juego'}
                      </span>
                      <h4 className="text-lg font-medium text-primary tracking-tight">
                        {game.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Juegos de respaldo si no hay datos
              [
                { _id: '1', title: 'Grand Theft Auto V', genre: 'Acción' },
                { _id: '2', title: 'The Witcher 3', genre: 'RPG' },
                { _id: '3', title: 'Minecraft', genre: 'Sandbox' },
                { _id: '4', title: 'Cyberpunk 2077', genre: 'RPG' }
              ].map((game) => (
                <Link 
                  key={game._id} 
                  to={`/gameList/gameDetails/${game._id}`}
                  className="group block aspect-[3/4] overflow-hidden border border-themed/40 hover:border-themed transition-colors"
                >
                  <div className="relative h-full">
                    <img 
                      src={`https://via.placeholder.com/400x600/1a1a1a/ffffff?text=${encodeURIComponent(game.title)}`} 
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-primary/90 dark:from-primary/95 to-transparent">
                      <span className="text-xs text-muted tracking-wide uppercase block mb-2">
                        {game.genre}
                      </span>
                      <h4 className="text-lg font-medium text-primary tracking-tight">
                        {game.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features - Enhanced Design */}
      <section className="py-24 bg-secondary/5 dark:bg-secondary/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-medium tracking-wider text-muted mb-4">
              Características
            </h2>
            <h3 className="text-4xl md:text-5xl font-light tracking-tight text-primary">
              Por qué Torrentio
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: 'Velocidad', 
                desc: 'Descargas optimizadas para máxima velocidad.', 
                icon: 'fas fa-bolt'
              },
              { 
                title: 'Seguridad', 
                desc: 'Verificación de cada archivo.', 
                icon: 'fas fa-shield-alt'
              },
              { 
                title: 'Comunidad', 
                desc: 'Espacio exclusivo para gamers.', 
                icon: 'fas fa-users'
              },
              { 
                title: 'Minimalismo', 
                desc: 'Interfaz limpia y funcional.', 
                icon: 'fas fa-minus'
              },
              { 
                title: 'Soporte', 
                desc: 'Asistencia técnica continua.', 
                icon: 'fas fa-headset'
              },
              { 
                title: 'Sincronización', 
                desc: 'Tu biblioteca en todos lados.', 
                icon: 'fas fa-sync'
              }
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-8 bg-tertiary/10 dark:bg-tertiary/5 rounded-2xl border border-themed/20 hover:border-themed/40 transition-all group">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-2xl text-primary group-hover:scale-110 transition-transform">
                  <i className={feature.icon}></i>
                </div>
                <h4 className="text-xl font-medium text-primary mb-4 tracking-tight">{feature.title}</h4>
                <p className="text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Enhanced */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight text-primary mb-8">
            Comienza tu experiencia
          </h2>
          <p className="text-xl text-secondary mb-12 font-light">
            Únete a miles de usuarios explorando el futuro digital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-none text-sm font-medium tracking-wide hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Crear Cuenta
            </Link>
            <Link
              to="/gameList"
              className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-none text-sm font-medium tracking-wide hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;