import React, { useState, useEffect } from 'react';
import { useDeveloperContext } from '../../context/DeveloperContext';
import LoadingState from '../../components/LoadingState/LoadingState';
import ErrorState from '../../components/ErrorState/ErrorState';
import { useDataLoading } from '../../hooks/useLoadingState';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('games');
  const [games, setGames] = useState([]);
  const { developers, loading: devLoading, error: devError, refetchDevelopers } = useDeveloperContext();
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    releaseYear: '',
    weight: '',
    image: '',
    developer: '',
    description: '',
    youtubeUrl: '',
    gallery: [],
    requirements: { gpu: '', ram: '', cpu: '' },
    downloadLink: '',
  });
  const [developerFormData, setDeveloperFormData] = useState({
    name: '',
    country: '',
    founded: '',
    description: '',
    website: '',
    logo: '',
  });
  
  // Hook personalizado para manejar la carga de juegos
  const { loading: gamesLoading, error: gamesError, data: gamesData, refetch: refetchGames } = useDataLoading(
    async () => {
      try {
        const response = await fetch('http://localhost:5000/api/games');
        if (!response.ok) {
          throw new Error('Error al obtener los juegos');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error('Error al cargar los juegos: ' + error.message);
      }
    },
    []
  );

  useEffect(() => {
    if (gamesData) {
      setGames(gamesData);
    }
  }, [gamesData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDeveloperInputChange = (e) => {
    const { name, value } = e.target;
    setDeveloperFormData({ ...developerFormData, [name]: value });
  };

  const handleFileChange = (e, field) => {
    if (field === 'gallery') {
      setFormData({ ...formData, gallery: Array.from(e.target.files) });
    } else {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const handleDeveloperFileChange = (e) => {
    setDeveloperFormData({ ...developerFormData, logo: e.target.files[0] });
  };

  const handleRequirementChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      requirements: { ...formData.requirements, [name]: value },
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      genre: '',
      releaseYear: '',
      weight: '',
      image: '',
      developer: '',
      description: '',
      youtubeUrl: '',
      gallery: [],
      requirements: { gpu: '', ram: '', cpu: '' },
      downloadLink: '',
    });
    setSelectedGame(null);
  };

  const resetDeveloperForm = () => {
    setDeveloperFormData({
      name: '',
      country: '',
      founded: '',
      description: '',
      website: '',
      logo: '',
    });
    setSelectedDeveloper(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formPayload = new FormData();
  
    // Recorremos formData para agregar sus valores al FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'requirements') {
        // Si 'requirements' es un objeto, lo recorremos para agregar sus propiedades
        Object.entries(value).forEach(([reqKey, reqValue]) => {
          formPayload.append(`requirements[${reqKey}]`, reqValue);
        });
      } else if (key === 'gallery' && value.length > 0) {
        // Si 'gallery' tiene archivos, los agregamos a formPayload
        value.forEach((file) => {
          formPayload.append('gallery', file);
        });
      } else if (key === 'image' && value instanceof File) {
        // Si 'image' es un archivo, lo agregamos a formPayload
        formPayload.append('image', value);
      } else if (key !== 'gallery' && key !== 'image') {
        // Para otros campos que no son archivos, los agregamos como strings
        formPayload.append(key, value);
      }
    });

    try {
      const url = selectedGame 
        ? `http://localhost:5000/api/games/${selectedGame._id}` 
        : 'http://localhost:5000/api/games';
      
      const method = selectedGame ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error('Error al guardar el juego');
      }

      // Recargar la lista de juegos
      refetchGames();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeveloperSubmit = async (e) => {
    e.preventDefault();
  
    const formPayload = new FormData();
  
    // Agregar campos del desarrollador
    Object.entries(developerFormData).forEach(([key, value]) => {
      if (key === 'logo' && value instanceof File) {
        formPayload.append('logo', value);
      } else if (key !== 'logo') {
        formPayload.append(key, value);
      }
    });

    try {
      const url = selectedDeveloper 
        ? `http://localhost:5000/api/developers/${selectedDeveloper._id}` 
        : 'http://localhost:5000/api/developers';
      
      const method = selectedDeveloper ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error('Error al guardar el desarrollador');
      }

      // Recargar la lista de desarrolladores
      refetchDevelopers();
      resetDeveloperForm();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (gameId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este juego?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/games/${gameId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el juego');
        }

        refetchGames();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleDeveloperDelete = async (developerId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este desarrollador?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/developers/${developerId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el desarrollador');
        }

        refetchDevelopers();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (game) => {
    setSelectedGame(game);
    setFormData({
      title: game.title || '',
      genre: game.genre || '',
      releaseYear: game.releaseYear || '',
      weight: game.weight || '',
      image: '',
      developer: game.developer || '',
      description: game.description || '',
      youtubeUrl: game.youtubeUrl || '',
      gallery: [],
      requirements: { 
        gpu: game.requirements?.gpu || '', 
        ram: game.requirements?.ram || '', 
        cpu: game.requirements?.cpu || '' 
      },
      downloadLink: game.downloadLink || '',
    });
  };

  const handleDeveloperEdit = (developer) => {
    setSelectedDeveloper(developer);
    setDeveloperFormData({
      name: developer.name || '',
      country: developer.country || '',
      founded: developer.founded || '',
      description: developer.description || '',
      website: developer.website || '',
      logo: '',
    });
  };

  if (gamesLoading || devLoading) {
    return <LoadingState />;
  }

  if (gamesError || devError) {
    return <ErrorState error={gamesError || devError} />;
  }

  return (
    <div className="min-h-screen bg-primary font-neue-haas">
      {/* Header Section */}
      <div className="bg-secondary/30 border-b border-themed/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted mb-8">
            <Link to="/" className="hover:text-purple-600 transition-colors">Inicio</Link>
            <i className="fas fa-chevron-right text-[8px] opacity-30"></i>
            <span className="text-primary">Administración</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="w-16 h-16 rounded-[1.5rem] bg-purple-600 flex items-center justify-center text-white text-2xl shadow-xl shadow-purple-600/20">
              <i className="fas fa-cog"></i>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight mb-2">
                Panel de Control
              </h1>
              <p className="text-secondary font-medium">
                Gestión centralizada de juegos y estudios asociados
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="mb-12">
          <div className="inline-flex p-1.5 bg-surface border border-themed/60 rounded-full shadow-sm">
            <button
              onClick={() => setActiveTab('games')}
              className={`px-8 py-3 rounded-full font-bold transition-all text-sm flex items-center gap-3 ${
                activeTab === 'games'
                  ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20'
                  : 'text-secondary hover:bg-tertiary/50'
              }`}
            >
              <i className="fas fa-gamepad text-xs"></i>
              Catálogo de Juegos
            </button>
            <button
              onClick={() => setActiveTab('developers')}
              className={`px-8 py-3 rounded-full font-bold transition-all text-sm flex items-center gap-3 ${
                activeTab === 'developers'
                  ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20'
                  : 'text-secondary hover:bg-tertiary/50'
              }`}
            >
              <i className="fas fa-users text-xs"></i>
              Estudios / Devs
            </button>
          </div>
        </div>

        {/* Games Tab */}
        {activeTab === 'games' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary tracking-tight">Gestión de Juegos</h2>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-surface border border-themed/60 text-primary hover:bg-tertiary rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
              >
                <i className="fas fa-plus text-[10px]"></i>
                Nuevo Registro
              </button>
            </div>

            <div className="bg-surface rounded-[2.5rem] border border-themed/60 p-8 sm:p-10 shadow-xl shadow-purple-500/5">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Título</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Género</label>
                    <input
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Lanzamiento</label>
                    <input
                      type="number"
                      name="releaseYear"
                      value={formData.releaseYear}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Tamaño (GB)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Desarrollador</label>
                    <input
                      type="text"
                      name="developer"
                      value={formData.developer}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Carátula</label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'image')}
                      className="w-full px-5 py-2.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-xs file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Descripción</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-5 py-3.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm resize-none"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">URL Tráiler</label>
                    <input
                      type="url"
                      name="youtubeUrl"
                      value={formData.youtubeUrl}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">URL Descarga</label>
                    <input
                      type="url"
                      name="downloadLink"
                      value={formData.downloadLink}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">GPU Mínima</label>
                    <input
                      type="text"
                      name="gpu"
                      value={formData.requirements.gpu}
                      onChange={handleRequirementChange}
                      className="w-full px-5 py-3.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">RAM Mínima</label>
                    <input
                      type="text"
                      name="ram"
                      value={formData.requirements.ram}
                      onChange={handleRequirementChange}
                      className="w-full px-5 py-3.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">CPU Mínima</label>
                    <input
                      type="text"
                      name="cpu"
                      value={formData.requirements.cpu}
                      onChange={handleRequirementChange}
                      className="w-full px-5 py-3.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-all shadow-xl shadow-purple-600/20 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <i className="fas fa-save text-sm"></i>
                    {selectedGame ? 'Actualizar Información' : 'Publicar Nuevo Juego'}
                  </button>
                  {selectedGame && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-10 py-4 bg-surface border border-themed/60 text-primary hover:bg-tertiary rounded-full font-bold transition-all active:scale-95"
                    >
                      Descartar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Games List Table */}
            <div className="bg-surface rounded-[2.5rem] border border-themed/60 overflow-hidden shadow-xl shadow-purple-500/5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary/50 border-b border-themed/40">
                      <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-widest">Título</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-widest">Género</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-widest">Año</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-widest">Estudio</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black text-muted uppercase tracking-widest">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-themed/30">
                    {games.map((game) => (
                      <tr key={game._id} className="hover:bg-tertiary/20 transition-colors group">
                        <td className="px-8 py-5 font-bold text-primary text-sm">{game.title}</td>
                        <td className="px-8 py-5 text-secondary text-sm">{game.genre}</td>
                        <td className="px-8 py-5 text-secondary text-sm">{game.releaseYear}</td>
                        <td className="px-8 py-5 text-secondary text-sm font-medium">{game.developer}</td>
                        <td className="px-8 py-5">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(game)}
                              className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                              title="Editar"
                            >
                              <i className="fas fa-edit text-xs"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(game._id)}
                              className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                              title="Eliminar"
                            >
                              <i className="fas fa-trash text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Developers Tab */}
        {activeTab === 'developers' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary tracking-tight">Gestión de Desarrolladores</h2>
              <button
                onClick={resetDeveloperForm}
                className="px-6 py-3 bg-surface border border-themed/60 text-primary hover:bg-tertiary rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
              >
                <i className="fas fa-plus text-[10px]"></i>
                Nuevo Estudio
              </button>
            </div>

            <div className="bg-surface rounded-[2.5rem] border border-themed/60 p-8 sm:p-10 shadow-xl shadow-purple-500/5">
              <form onSubmit={handleDeveloperSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={developerFormData.name}
                      onChange={handleDeveloperInputChange}
                      className="w-full px-5 py-3.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">País</label>
                    <input
                      type="text"
                      name="country"
                      value={developerFormData.country}
                      onChange={handleDeveloperInputChange}
                      className="w-full px-5 py-3.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Fundación</label>
                    <input
                      type="number"
                      name="founded"
                      value={developerFormData.founded}
                      onChange={handleDeveloperInputChange}
                      className="w-full px-5 py-3.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Sitio Web</label>
                    <input
                      type="url"
                      name="website"
                      value={developerFormData.website}
                      onChange={handleDeveloperInputChange}
                      className="w-full px-5 py-3.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Logotipo del Estudio</label>
                    <input
                      type="file"
                      onChange={handleDeveloperFileChange}
                      className="w-full px-5 py-2.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-xs file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Historia / Descripción</label>
                  <textarea
                    name="description"
                    value={developerFormData.description}
                    onChange={handleDeveloperInputChange}
                    rows="4"
                    className="w-full px-5 py-3.5 bg-tertiary/20 border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm resize-none"
                    required
                  ></textarea>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-all shadow-xl shadow-purple-600/20 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <i className="fas fa-save text-sm"></i>
                    {selectedDeveloper ? 'Actualizar Estudio' : 'Registrar Nuevo Estudio'}
                  </button>
                  {selectedDeveloper && (
                    <button
                      type="button"
                      onClick={resetDeveloperForm}
                      className="px-10 py-4 bg-surface border border-themed/60 text-primary hover:bg-tertiary rounded-full font-bold transition-all active:scale-95"
                    >
                      Descartar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Developers List Table */}
            <div className="bg-surface rounded-[2.5rem] border border-themed/60 overflow-hidden shadow-xl shadow-purple-500/5">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary/50 border-b border-themed/40">
                      <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-widest">Estudio</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-widest">Sede</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-widest">Fundado</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-widest">Website</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black text-muted uppercase tracking-widest">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-themed/30">
                    {developers.map((developer) => (
                      <tr key={developer._id} className="hover:bg-tertiary/20 transition-colors group">
                        <td className="px-8 py-5 font-bold text-primary text-sm">{developer.name}</td>
                        <td className="px-8 py-5 text-secondary text-sm">{developer.country}</td>
                        <td className="px-8 py-5 text-secondary text-sm">{developer.founded}</td>
                        <td className="px-8 py-5">
                          {developer.website && (
                            <a href={developer.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline text-sm font-bold">
                              Visitar Sitio
                            </a>
                          )}
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleDeveloperEdit(developer)}
                              className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                              title="Editar"
                            >
                              <i className="fas fa-edit text-xs"></i>
                            </button>
                            <button
                              onClick={() => handleDeveloperDelete(developer._id)}
                              className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                              title="Eliminar"
                            >
                              <i className="fas fa-trash text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;



