import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api.js';

export const useAppStats = () => {
  const [stats, setStats] = useState({
    users: 0,
    games: 0,
    developers: 0,
    downloads: 0,
    loading: true,
    error: null
  });

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      // Usar la nueva API optimizada de estadísticas
      const response = await axios.get(`${API_URL}/api/stats`);
      
      if (response.data.success) {
        const statsData = response.data.data;
        
        setStats({
          users: statsData.users,
          games: statsData.games,
          developers: statsData.developers,
          downloads: statsData.downloads,
          loading: false,
          error: null,
          lastUpdate: statsData.lastUpdate,
          avgGamesPerDeveloper: statsData.avgGamesPerDeveloper
        });
      } else {
        throw new Error(response.data.message || 'Error al obtener estadísticas');
      }

    } catch (error) {
      console.error('Error fetching stats:', error);
      
      // Fallback: intentar obtener datos individuales si la API de stats falla
      try {
        const [usersResponse, gamesResponse, developersResponse] = await Promise.all([
          axios.get(`${API_URL}/api/users`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/games`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/api/developers`).catch(() => ({ data: [] }))
        ]);

        const usersCount = Array.isArray(usersResponse.data) ? usersResponse.data.length : 0;
        const gamesCount = Array.isArray(gamesResponse.data) ? gamesResponse.data.length : 0;
        const developersCount = Array.isArray(developersResponse.data) ? developersResponse.data.length : 0;

        setStats({
          users: usersCount,
          games: gamesCount,
          developers: developersCount,
          downloads: gamesCount * 150,
          loading: false,
          error: null
        });
      } catch (fallbackError) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Error al cargar estadísticas'
        }));
      }
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Función para refrescar las estadísticas
  const refreshStats = () => {
    fetchStats();
  };

  // Función para formatear números grandes
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return {
    ...stats,
    refreshStats,
    formatNumber,
    // Estadísticas formateadas para mostrar
    formattedStats: {
      users: formatNumber(stats.users),
      games: formatNumber(stats.games),
      developers: formatNumber(stats.developers),
      downloads: formatNumber(stats.downloads)
    }
  };
};
