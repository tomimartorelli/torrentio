import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('es');

  // Aplicar tema del usuario cuando cambie
  useEffect(() => {
    if (user?.preferences?.theme) {
      applyTheme(user.preferences.theme);
      setTheme(user.preferences.theme);
    }
    if (user?.preferences?.language) {
      setLanguage(user.preferences.language);
    }
  }, [user]);

  // Aplicar tema automático basado en preferencias del sistema
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyTheme(mediaQuery.matches ? 'dark' : 'light');
      };
      
      handleChange(); // Aplicar inmediatamente
      mediaQuery.addListener(handleChange);
      
      return () => mediaQuery.removeListener(handleChange);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Actualizar color de fondo del body para evitar flash blanco
    document.body.style.backgroundColor = newTheme === 'dark' ? '#0f172a' : '#ffffff';
    document.body.style.color = newTheme === 'dark' ? '#f8fafc' : '#1a1a1a';
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme === 'auto' ? 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
      newTheme
    );
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'dark':
        return 'Oscuro';
      case 'light':
        return 'Claro';
      case 'auto':
        return 'Automático';
      default:
        return 'Claro';
    }
  };

  const getLanguageLabel = () => {
    switch (language) {
      case 'es':
        return 'Español';
      case 'en':
        return 'English';
      case 'fr':
        return 'Français';
      default:
        return 'Español';
    }
  };

  // Textos según idioma
  const texts = {
    es: {
      home: 'Inicio',
      profile: 'Perfil',
      games: 'Juegos',
      developers: 'Desarrolladores',
      admin: 'Admin',
      logout: 'Cerrar Sesión',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      search: 'Buscar...',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      save: 'Guardar',
      edit: 'Editar',
      delete: 'Eliminar',
      settings: 'Configuración',
      preferences: 'Preferencias',
      security: 'Seguridad',
      activity: 'Actividad',
      personalInfo: 'Información Personal',
      darkMode: 'Modo Oscuro',
      language: 'Idioma',
      notifications: 'Notificaciones',
      privacy: 'Privacidad'
    },
    en: {
      home: 'Home',
      profile: 'Profile',
      games: 'Games',
      developers: 'Developers',
      admin: 'Admin',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      search: 'Search...',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      settings: 'Settings',
      preferences: 'Preferences',
      security: 'Security',
      activity: 'Activity',
      personalInfo: 'Personal Information',
      darkMode: 'Dark Mode',
      language: 'Language',
      notifications: 'Notifications',
      privacy: 'Privacy'
    },
    fr: {
      home: 'Accueil',
      profile: 'Profil',
      games: 'Jeux',
      developers: 'Développeurs',
      admin: 'Admin',
      logout: 'Déconnexion',
      login: 'Connexion',
      register: "S'inscrire",
      search: 'Rechercher...',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      save: 'Sauvegarder',
      edit: 'Modifier',
      delete: 'Supprimer',
      settings: 'Paramètres',
      preferences: 'Préférences',
      security: 'Sécurité',
      activity: 'Activité',
      personalInfo: 'Informations Personnelles',
      darkMode: 'Mode Sombre',
      language: 'Langue',
      notifications: 'Notifications',
      privacy: 'Confidentialité'
    }
  };

  const t = (key) => {
    return texts[language]?.[key] || texts.es[key] || key;
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      language,
      changeTheme,
      setLanguage,
      getThemeLabel,
      getLanguageLabel,
      applyTheme,
      t // función de traducción
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
