import React from 'react';

const LoadingState = ({ 
  variant = 'default', 
  message = 'Cargando...', 
  size = 'medium',
  className = '' 
}) => {
  const variants = {
    default: {
      container: "min-h-screen bg-white flex items-center justify-center",
      spinner: "w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4",
      text: "text-gray-800 text-lg font-medium"
    },
    card: {
      container: "bg-white rounded-xl border border-gray-200 p-8 flex items-center justify-center shadow-lg",
      spinner: "w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3",
      text: "text-gray-700 text-sm"
    },
    inline: {
      container: "flex items-center justify-center py-8",
      spinner: "w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2",
      text: "text-gray-700 text-sm"
    },
    skeleton: {
      container: "animate-pulse",
      spinner: "hidden",
      text: "hidden"
    }
  };

  const sizes = {
    small: {
      spinner: "w-8 h-8",
      text: "text-sm"
    },
    medium: {
      spinner: "w-16 h-16",
      text: "text-lg"
    },
    large: {
      spinner: "w-24 h-24",
      text: "text-xl"
    }
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  if (variant === 'skeleton') {
    return (
      <div className={`${currentVariant.container} ${className}`}>
        <div className="space-y-4 w-full">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${currentVariant.container} ${className}`}>
      <div className="text-center">
        <div className={`${currentVariant.spinner} ${currentSize.spinner}`}></div>
        <p className={`${currentVariant.text} ${currentSize.text}`}>{message}</p>
      </div>
    </div>
  );
};

export default LoadingState; 