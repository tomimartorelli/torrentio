import React, { useState, useEffect } from 'react';

const Toast = ({ message, type, duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const baseStyles = isDark ? 'text-white' : 'text-white';
    
    switch (type) {
      case 'success':
        return `bg-green-500 ${baseStyles} border-green-600`;
      case 'error':
        return `bg-red-500 ${baseStyles} border-red-600`;
      case 'warning':
        return `bg-yellow-500 ${baseStyles} border-yellow-600`;
      case 'info':
        return `bg-blue-500 ${baseStyles} border-blue-600`;
      default:
        return `bg-gray-500 ${baseStyles} border-gray-600`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-bell';
    }
  };

  return (
    <div 
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
        isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div className={`rounded-lg border shadow-lg p-4 ${getToastStyles()}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <i className={`${getIcon()} text-lg`}></i>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => {
                setIsLeaving(true);
                setTimeout(() => {
                  setIsVisible(false);
                  onClose();
                }, 300);
              }}
              className="inline-flex text-white hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
