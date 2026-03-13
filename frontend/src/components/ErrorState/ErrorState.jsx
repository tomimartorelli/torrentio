import React from 'react';

const ErrorState = ({ 
  error, 
  onRetry, 
  variant = 'default',
  className = '' 
}) => {
  const variants = {
    default: {
      container: "min-h-screen bg-white flex items-center justify-center",
      icon: "w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4",
      iconClass: "fas fa-exclamation-triangle text-2xl text-red-500",
      title: "text-2xl font-bold text-gray-800 mb-2",
      message: "text-gray-600 text-sm mb-6",
      button: "px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
    },
    card: {
      container: "bg-white rounded-xl border border-red-200 p-6 flex items-center justify-center shadow-lg",
      icon: "w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3",
      iconClass: "fas fa-exclamation-triangle text-xl text-red-500",
      title: "text-lg font-bold text-gray-800 mb-2",
      message: "text-gray-600 text-xs mb-4",
      button: "px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-sm"
    },
    inline: {
      container: "flex items-center justify-center py-4",
      icon: "w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2",
      iconClass: "fas fa-exclamation-triangle text-sm text-red-500",
      title: "text-sm font-bold text-gray-800 mb-1",
      message: "text-gray-600 text-xs mb-3",
      button: "px-3 py-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 text-xs"
    }
  };

  const currentVariant = variants[variant];

  return (
    <div className={`${currentVariant.container} ${className}`}>
      <div className="text-center">
        <div className={currentVariant.icon}>
          <i className={currentVariant.iconClass}></i>
        </div>
        <h3 className={currentVariant.title}>
          Error al cargar los datos
        </h3>
        <p className={currentVariant.message}>
          {error || 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className={currentVariant.button}
          >
            <i className="fas fa-refresh mr-2"></i>
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState; 