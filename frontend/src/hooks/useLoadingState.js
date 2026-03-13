import { useState, useEffect } from 'react';

export const useLoadingState = (dependencies = [], initialLoading = true) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (dependencies.length > 0) {
      setLoading(true);
      setError(null);
    }
  }, dependencies);

  const startLoading = () => {
    setLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const setErrorState = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  const setDataState = (newData) => {
    setData(newData);
    setLoading(false);
    setError(null);
  };

  return {
    loading,
    error,
    data,
    startLoading,
    stopLoading,
    setErrorState,
    setDataState
  };
};

export const useDataLoading = (fetchFunction, dependencies = []) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFunction();
        setData(result);
      } catch (err) {
        setError(err.message || 'Error al cargar los datos');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'Error al recargar los datos');
      console.error('Error refetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    refetch
  };
}; 