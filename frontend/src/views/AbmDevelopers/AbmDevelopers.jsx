import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AbmDevelopers = () => {
  const [name, setName] = useState('');
  const [founded, setFounded] = useState('');
  const [country, setCountry] = useState('');
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [editName, setEditName] = useState('');
  const [editFounded, setEditFounded] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/developers');
        if (!response.ok) {
          throw new Error('Error al traer los desarrolladores');
        }
        const data = await response.json();
        setDevelopers(data);
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message);
      }
    };

    fetchDevelopers();
  }, []);

  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) errors.name = 'El nombre es obligatorio.';
    if (!data.country.trim()) errors.country = 'El país es obligatorio.';
    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errors = validateForm({ name, country });

    if (Object.keys(errors).length > 0) {
      setErrorMessage(Object.values(errors).join(' '));
      return;
    }

    try {
              const response = await fetch('http://localhost:5000/api/developers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, founded, country }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el desarrollador');
      }

      const newDeveloper = await response.json();
      setDevelopers((prev) => [...prev, newDeveloper]);
      setName('');
      setFounded('');
      setCountry('');
      setSuccessMessage('Desarrollador registrado exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedDeveloper) return;

    try {
      const response = await fetch(`http://localhost:5000/api/developers/${selectedDeveloper}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDevelopers(developers.filter(dev => dev.name !== selectedDeveloper));
        setSelectedDeveloper(null);
        setSuccessMessage('Desarrollador borrado exitosamente!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setErrorMessage('Error al borrar el desarrollador: ' + (errorData.message || response.statusText));
      }
    } catch (error) {
      console.error('Error al borrar el desarrollador:', error);
      setErrorMessage('Error al borrar el desarrollador: ' + error.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const errors = validateForm({ name: editName, country: editCountry });

    if (Object.keys(errors).length > 0) {
      setErrorMessage(Object.values(errors).join(' '));
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/developers/${selectedDeveloper}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName, founded: editFounded, country: editCountry }),
      });

      if (!response.ok) {
        throw new Error('Error al editar el desarrollador');
      }

      const updatedDeveloper = await response.json();
      setDevelopers(developers.map((dev) => (dev.name === selectedDeveloper ? updatedDeveloper : dev)));
      setEditName('');
      setEditFounded('');
      setEditCountry('');
      setSelectedDeveloper(null);
      setSuccessMessage('Desarrollador editado exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Optimizado para móviles */}
      <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-b border-blue-200">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
          {/* Breadcrumb - Más compacto en móviles */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <i className="fas fa-home text-xs"></i>
              <span className="hidden sm:inline">Home</span>
            </Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <span className="text-gray-700 flex items-center gap-1">
              <i className="fas fa-users text-xs"></i>
              <span className="hidden sm:inline">Desarrolladores</span>
            </span>
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg">
                <i className="fas fa-users"></i>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1">
                  Gestión de Desarrolladores
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Administra los desarrolladores de juegos
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards - Optimizados para móviles */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <i className="fas fa-users text-white text-xs sm:text-sm"></i>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-gray-800">{developers?.length || 0}</div>
                  <div className="text-gray-500 text-xs">Total</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <i className="fas fa-gamepad text-white text-xs sm:text-sm"></i>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-gray-800">
                    {developers?.reduce((acc, dev) => acc + (dev.gamesCount || 0), 0) || 0}
                  </div>
                  <div className="text-gray-500 text-xs">Juegos</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <i className="fas fa-plus text-white text-xs sm:text-sm"></i>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-gray-800">+</div>
                  <div className="text-gray-500 text-xs">Agregar Nuevo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal - Optimizado para móviles */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Formulario de Desarrollador */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
              {editingDeveloper ? 'Editar Desarrollador' : 'Agregar Nuevo Desarrollador'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sitio Web</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                  required
                />
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm"
                >
                  <i className="fas fa-save mr-2"></i>
                  {editingDeveloper ? 'Actualizar' : 'Agregar'}
                </button>
                {editingDeveloper && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-300 text-sm"
                  >
                    <i className="fas fa-times mr-2"></i>
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            {/* Mensajes de estado */}
            {message && (
              <div className={`mt-4 p-3 sm:p-4 rounded-lg sm:rounded-xl text-sm ${
                message.type === 'success' 
                  ? 'bg-green-100 border border-green-200 text-green-800' 
                  : 'bg-red-100 border border-red-200 text-red-800'
              }`}>
                {message.text}
              </div>
            )}
          </div>

          {/* Lista de Desarrolladores */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Desarrolladores Existentes</h2>
            
            <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
              {developers?.map((developer) => (
                <div key={developer._id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <i className="fas fa-users text-white text-xs sm:text-sm"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{developer.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{developer.country}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 sm:gap-2">
                    <button
                      onClick={() => handleEdit(developer)}
                      className="px-2 sm:px-3 py-1 sm:py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm transition-all duration-300"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(developer._id)}
                      className="px-2 sm:px-3 py-1 sm:py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs sm:text-sm transition-all duration-300"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AbmDevelopers