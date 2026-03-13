import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar juegos y categorías en paralelo
        const [gamesResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/games'),
          axios.get('http://localhost:5000/api/categories')
        ]);

        setGames(gamesResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching games or categories:', error);
        setError(error.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addGame = async (game) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/games', game); 
      setGames((prevGames) => [...prevGames, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding game:', error);
      setError(error.message || 'Error al agregar el juego');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateGame = async (gameId, gameData) => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/api/games/${gameId}`, gameData);
      setGames((prevGames) => 
        prevGames.map((game) => 
          game._id === gameId ? response.data : game
        )
      );
      return response.data;
    } catch (error) {
      console.error('Error updating game:', error);
      setError(error.message || 'Error al actualizar el juego');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteGame = async (gameId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/games/${gameId}`);
      setGames((prevGames) => prevGames.filter((game) => game._id !== gameId));
    } catch (error) {
      console.error('Error deleting game:', error);
      setError(error.message || 'Error al eliminar el juego');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/games');
      setGames(response.data);
    } catch (error) {
      console.error('Error refetching games:', error);
      setError(error.message || 'Error al recargar los juegos');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el nombre de la categoría por ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  return (
    <GameContext.Provider value={{ 
      games, 
      categories, 
      loading, 
      error, 
      addGame, 
      updateGame, 
      deleteGame, 
      refetchGames, 
      getCategoryName 
    }}>
      {children}
    </GameContext.Provider>
  );
};

// Hook para acceder al contexto
export const useGameContext = () => {
  return useContext(GameContext);
};
