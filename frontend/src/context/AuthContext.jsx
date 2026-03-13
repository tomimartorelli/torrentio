import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Obtener el token de localStorage
    if (token) {
      try {
        // Decodificar el token
        const decoded = jwtDecode(token);
        console.log('Decoded Token:', decoded); // Mostrar el token decodificado para verificar su contenido
        setUser(decoded); // Almacenar la información del usuario en el estado
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('authToken'); // Limpiar token inválido
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const updateUser = (newToken) => {
    if (newToken) {
      localStorage.setItem('authToken', newToken);
      const decoded = jwtDecode(newToken);
      setUser(decoded);
    }
  };

  const hasRole = (role) => {
    console.log('Checking role:', user?.role); // Ver el rol que estamos comprobando
    return user && user.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
