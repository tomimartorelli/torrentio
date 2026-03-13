import { useEffect, useCallback } from 'react';

export const useScrollOptimization = () => {
  // Optimizar scroll con throttling
  const throttle = useCallback((func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }, []);

  // Optimizar animaciones en scroll
  const handleScroll = useCallback(() => {
    const elements = document.querySelectorAll('[data-animate-on-scroll]');
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('animate-in');
      }
    });
  }, []);

  useEffect(() => {
    // Aplicar optimizaciones de scroll
    const throttledScroll = throttle(handleScroll, 16); // 60fps
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Optimizar repaints
    document.body.style.willChange = 'scroll-position';
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      document.body.style.willChange = 'auto';
    };
  }, [handleScroll, throttle]);

  return {
    // Función para agregar animación a elementos
    addScrollAnimation: (element, animationClass = 'fade-in') => {
      if (element) {
        element.setAttribute('data-animate-on-scroll', 'true');
        element.classList.add(animationClass);
      }
    }
  };
}; 