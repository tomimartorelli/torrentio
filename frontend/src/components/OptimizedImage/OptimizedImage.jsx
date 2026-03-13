import React, { useState, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/images/placeholder-game.jpg',
  fallback = '/images/placeholder-game.jpg',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setImageSrc(fallback);
      setIsLoading(false);
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
    };

    img.onerror = () => {
      setImageSrc(fallback);
      setIsLoading(false);
      setHasError(true);
    };

    img.src = src;
  }, [src, fallback]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder de carga */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
      {/* Imagen optimizada */}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-500 ease-out ${
          isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } ${hasError ? 'filter grayscale' : ''}`}
        loading="lazy"
        decoding="async"
        {...props}
      />
      
      {/* Overlay de error */}
      {hasError && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-center">
            <i className="fas fa-image text-2xl mb-2"></i>
            <p className="text-sm">Imagen no disponible</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 