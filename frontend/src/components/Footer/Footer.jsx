import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary border-t border-themed/30 font-neue-haas relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 sm:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Brand Section */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
              <Link to="/" className="inline-block transition-all hover:opacity-80 active:scale-95">
                <img 
                  src="/images/TORRENTIO4.png" 
                  alt="Torrentio Logo" 
                  className="h-28 sm:h-36 w-auto object-contain filter brightness-110 drop-shadow-[0_0_15px_rgba(147,51,234,0.1)]"
                />
              </Link>
              <p className="text-secondary text-xl font-medium leading-relaxed max-w-md">
                Elevando la experiencia de software. <br/>
                <span className="text-muted text-lg font-normal">Minimalismo, velocidad y seguridad absoluta en cada descarga.</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {[
                { icon: 'discord', link: '#', label: 'Discord' },
                { icon: 'x-twitter', link: '#', label: 'X (Twitter)' },
                { icon: 'instagram', link: '#', label: 'Instagram' },
                { icon: 'github', link: '#', label: 'GitHub' }
              ].map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.link} 
                  aria-label={social.label}
                  className="w-12 h-12 flex items-center justify-center bg-surface border border-themed/40 text-secondary hover:border-purple-500 hover:text-purple-500 rounded-full transition-all active:scale-90 shadow-sm"
                >
                  <i className={`fab fa-${social.icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-8">
            {/* Exploration */}
            <div className="space-y-8">
              <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Exploración</h3>
              <ul className="space-y-5">
                {[
                  { to: '/gameList', label: 'Catálogo Global' },
                  { to: '/developers', label: 'Estudios Asociados' },
                  { to: '/categories', label: 'Géneros Populares' }
                ].map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="text-[15px] font-bold text-secondary hover:text-purple-500 transition-all flex items-center group">
                      <span className="w-0 group-hover:w-2 h-px bg-purple-500 mr-0 group-hover:mr-3 transition-all duration-300"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-8">
              <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Soporte</h3>
              <ul className="space-y-5">
                {[
                  { to: '/contact', label: 'Centro de Contacto' },
                  { to: '#', label: 'Base de Conocimiento' },
                  { to: '#', label: 'Estado de Servidores' }
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.to} className="text-[15px] font-bold text-secondary hover:text-purple-500 transition-all flex items-center group">
                      <span className="w-0 group-hover:w-2 h-px bg-purple-500 mr-0 group-hover:mr-3 transition-all duration-300"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-8">
              <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Legal</h3>
              <ul className="space-y-5">
                {[
                  { to: '#', label: 'Privacidad' },
                  { to: '#', label: 'Términos de Uso' },
                  { to: '#', label: 'Política de Cookies' }
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.to} className="text-[15px] font-bold text-secondary hover:text-purple-500 transition-all flex items-center group">
                      <span className="w-0 group-hover:w-2 h-px bg-purple-500 mr-0 group-hover:mr-3 transition-all duration-300"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-themed/20 mt-24 sm:mt-32 pt-12 flex flex-col sm:flex-row items-center justify-between gap-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <p className="text-[11px] font-bold text-muted uppercase tracking-widest">
              © 2026 TORRENTIO PROJECT. <span className="hidden sm:inline-block mx-2 opacity-30">|</span> ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-3 px-4 py-2 bg-green-500/5 border border-green-500/20 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Global Systems Operational</span>
            </div>
          </div>

          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-4 text-[11px] font-black text-primary uppercase tracking-widest hover:text-purple-500 transition-colors"
          >
            Volver Arriba
            <div className="w-10 h-10 rounded-full border border-themed/40 flex items-center justify-center group-hover:border-purple-500 group-hover:bg-purple-500/5 transition-all">
              <i className="fas fa-arrow-up text-xs group-hover:-translate-y-1 transition-transform"></i>
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
