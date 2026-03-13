import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DeveloperContext = createContext();

export const DeveloperProvider = ({ children }) => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5000/api/developers');
        setDevelopers(response.data);
      } catch (error) {
        console.error('Error fetching developers:', error);
        setError(error.message || 'Error al cargar los desarrolladores');
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  // Método para agregar una desarrolladora
  const addDeveloper = async (developer) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/developers', developer);
      setDevelopers((prevDevelopers) => [...prevDevelopers, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding developer:', error);
      setError(error.message || 'Error al agregar el desarrollador');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Método para actualizar una desarrolladora
  const updateDeveloper = async (developerId, developerData) => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/api/developers/${developerId}`, developerData);
      setDevelopers((prevDevelopers) => 
        prevDevelopers.map((developer) => 
          developer._id === developerId ? response.data : developer
        )
      );
      return response.data;
    } catch (error) {
      console.error('Error updating developer:', error);
      setError(error.message || 'Error al actualizar el desarrollador');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Método para eliminar una desarrolladora
  const deleteDeveloper = async (developerId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/developers/${developerId}`);
      setDevelopers((prevDevelopers) => prevDevelopers.filter((developer) => developer._id !== developerId));
    } catch (error) {
      console.error('Error deleting developer:', error);
      setError(error.message || 'Error al eliminar el desarrollador');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Método para recargar desarrolladores
  const refetchDevelopers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/developers');
      setDevelopers(response.data);
    } catch (error) {
      console.error('Error refetching developers:', error);
      setError(error.message || 'Error al recargar los desarrolladores');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeveloperContext.Provider value={{ 
      developers, 
      loading, 
      error, 
      addDeveloper, 
      updateDeveloper, 
      deleteDeveloper, 
      refetchDevelopers 
    }}>
      {children}
    </DeveloperContext.Provider>
  );
};

export const useDeveloperContext = () => {
  return useContext(DeveloperContext);
};
