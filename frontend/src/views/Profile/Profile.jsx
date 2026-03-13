import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { changeTheme, setLanguage, t } = useTheme();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: user?.avatar || null
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    pushNotifications: user?.preferences?.pushNotifications ?? false,
    marketingEmails: user?.preferences?.marketingEmails ?? false,
    theme: user?.preferences?.theme ?? 'light',
    language: user?.preferences?.language ?? 'es',
    privacy: user?.preferences?.privacy ?? 'public'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: user?.securitySettings?.twoFactorAuth ?? false,
    loginAlerts: user?.securitySettings?.loginAlerts ?? true,
    deviceHistory: user?.securitySettings?.deviceHistory ?? true
  });

  const [activityLog, setActivityLog] = useState([]);

  // Cargar historial de actividad cuando se selecciona la tab
  const loadActivityLog = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/users/activity', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setActivityLog(data.activity || []);
      }
    } catch (error) {
      console.error('Error al cargar historial de actividad:', error);
    }
  };

  // Cargar actividad cuando se selecciona la tab
  React.useEffect(() => {
    if (activeTab === 'activity') {
      loadActivityLog();
    }
  }, [activeTab]);

  // Calcular completitud del perfil
  const getProfileCompletion = () => {
    const fields = ['name', 'email', 'phone', 'bio', 'location'];
    const completed = fields.filter(field => formData[field] && formData[field].length > 0).length;
    return Math.round((completed / fields.length) * 100);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePreferenceChange = async (key, value) => {
    const newPreferences = {
      ...preferences,
      [key]: value
    };
    
    setPreferences(newPreferences);
    
    // Aplicar cambios inmediatamente en la UI
    if (key === 'theme') {
      changeTheme(value);
    } else if (key === 'language') {
      setLanguage(value);
    }
    
    // Guardar en backend
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/users/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ preferences: newPreferences })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar preferencias');
      }

      showSuccess('Preferencia actualizada correctamente');
    } catch (error) {
      showError(error.message);
      // Revertir cambio en caso de error
      setPreferences(prev => {
        const reverted = {
          ...prev,
          [key]: key === 'theme' || key === 'language' ? prev[key] : !value
        };
        
        // Revertir cambios en la UI también
        if (key === 'theme') {
          changeTheme(prev[key]);
        } else if (key === 'language') {
          setLanguage(prev[key]);
        }
        
        return reverted;
      });
    }
  };

  const handleSecurityChange = async (key, value) => {
    const newSecuritySettings = {
      ...securitySettings,
      [key]: value
    };
    
    setSecuritySettings(newSecuritySettings);
    
    // Guardar en backend
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/users/security-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ securitySettings: newSecuritySettings })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar configuración de seguridad');
      }

      showSuccess('Configuración de seguridad actualizada correctamente');
    } catch (error) {
      showError(error.message);
      // Revertir cambio en caso de error
      setSecuritySettings(prev => ({
        ...prev,
        [key]: !value
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ type: 'error', text: 'La imagen debe ser menor a 5MB' });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (isChangingPassword) {
      // Validar contraseñas
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
        setLoading(false);
        return;
      }
      
      if (formData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres' });
        setLoading(false);
        return;
      }

      // Cambiar contraseña
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/users/change-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al cambiar contraseña');
        }

        setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
        setIsChangingPassword(false);
        
        // Limpiar campos de contraseña
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      }
    } else {
      // Actualizar perfil
      try {
        const token = localStorage.getItem('authToken');
        
        // Usar FormData para enviar archivos
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone || '');
        formDataToSend.append('bio', formData.bio || '');
        formDataToSend.append('location', formData.location || '');
        formDataToSend.append('website', formData.website || '');
        
        // Si hay un archivo de avatar, agregarlo
        if (fileInputRef.current?.files[0]) {
          formDataToSend.append('avatar', fileInputRef.current.files[0]);
        }

        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
            // No incluir Content-Type para FormData
          },
          body: formDataToSend
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al actualizar perfil');
        }

        const data = await response.json();
        
        // Actualizar el token con los nuevos datos
        if (data.token) {
          updateUser(data.token);
        }

        setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
        setIsEditing(false);
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      }
    }

    setLoading(false);
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => setMessage(null), 5000);
  };

  const handleLogout = () => {
    logout();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      avatar: user?.avatar || null
    });
    setMessage(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-6 font-neue-haas">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-8 rounded-[2rem] bg-secondary border border-themed/50 flex items-center justify-center shadow-sm">
            <i className="fas fa-lock text-muted text-3xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-primary mb-4 tracking-tight">Acceso Denegado</h2>
          <p className="text-secondary mb-10 text-lg leading-relaxed">Debes iniciar sesión para acceder a tu perfil personal y configuraciones.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg active:scale-95"
          >
            <i className="fas fa-sign-in-alt text-sm"></i>
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  const profileCompletion = getProfileCompletion();

  return (
    <div className="min-h-screen bg-primary font-neue-haas">
      {/* Header Section */}
      <div className="bg-secondary/30 border-b border-themed/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted mb-10">
            <Link to="/" className="hover:text-purple-600 transition-colors">Inicio</Link>
            <i className="fas fa-chevron-right text-[8px] opacity-30"></i>
            <span className="text-primary">Mi Perfil</span>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
            {/* Avatar & Upload */}
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[3rem] overflow-hidden bg-surface border-4 border-surface shadow-2xl shadow-purple-500/10 flex items-center justify-center relative">
                {formData.avatar ? (
                  <img 
                    src={formData.avatar.startsWith('data:') ? formData.avatar : `http://localhost:5000/${formData.avatar}`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                {!formData.avatar && (
                  <i className="fas fa-user text-5xl text-muted"></i>
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-12 h-12 bg-white text-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <i className="fas fa-camera"></i>
                    </button>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>

            {/* User Info & Progress */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">{user.name}</h1>
                  {user.role === 'admin' && (
                    <span className="px-3 py-1 bg-purple-600 text-[10px] font-black text-white uppercase tracking-widest rounded-full shadow-lg shadow-purple-500/20">
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="text-lg text-secondary font-medium">{user.email}</p>
              </div>
              
              <div className="max-w-md mx-auto lg:mx-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Estado del Perfil</span>
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">{profileCompletion}% Completado</span>
                </div>
                <div className="w-full bg-tertiary/40 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-purple-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Global Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-10 py-4 rounded-full font-bold text-sm transition-all active:scale-95 flex items-center gap-2 ${
                  isEditing 
                    ? 'bg-surface border border-themed text-primary hover:bg-tertiary' 
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-xl shadow-purple-600/20'
                }`}
              >
                <i className={`fas fa-${isEditing ? 'times' : 'pen-to-square'} text-xs`}></i>
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </button>
              <button
                onClick={handleLogout}
                className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm border border-red-100 dark:border-red-900/30"
                title="Cerrar Sesión"
              >
                <i className="fas fa-power-off"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-1/4 h-full bg-purple-500/5 blur-[100px] -z-0"></div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Status Messages */}
        {message && (
          <div className={`mb-10 p-5 rounded-[1.5rem] animate-in fade-in slide-in-from-top-4 duration-500 flex items-center gap-4 border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-100 text-green-700' 
              : 'bg-red-50 border-red-100 text-red-700'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
            </div>
            <p className="text-sm font-bold">{message.text}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-16">
                  <div className="lg:col-span-3 space-y-8">
            <div className="bg-surface rounded-[2.5rem] border border-themed/60 p-4 space-y-2 shadow-sm">
              {[
                { id: 'personal', label: 'Datos Personales', icon: 'user' },
                { id: 'security', label: 'Seguridad', icon: 'shield-halved' },
                { id: 'preferences', label: 'Preferencias', icon: 'sliders' },
                { id: 'activity', label: 'Actividad', icon: 'clock-rotate-left' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-full font-bold text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-secondary hover:bg-tertiary hover:text-primary'
                  }`}
                >
                  <i className={`fas fa-${tab.icon} w-5 text-center`}></i>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Desktop Stats Card */}
            <div className="hidden lg:block bg-surface rounded-[2.5rem] border border-themed/60 p-8 space-y-6">
              <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest px-1">Cuenta</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-tertiary/20 rounded-2xl border border-themed/30">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Rol</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-tertiary/20 rounded-2xl border border-themed/30">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Miembro</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="lg:col-span-9">
            {activeTab === 'personal' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-themed/40 pb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-primary tracking-tight">Información Personal</h2>
                    <p className="text-secondary mt-1">Gestiona tus datos básicos y biografía pública.</p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Nombre Completo</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-6 py-4 bg-tertiary/20 dark:bg-primary border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all disabled:opacity-50"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Correo Electrónico</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-6 py-4 bg-tertiary/20 dark:bg-primary border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all disabled:opacity-50"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Teléfono</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-6 py-4 bg-tertiary/20 dark:bg-primary border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all disabled:opacity-50"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Ubicación</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-6 py-4 bg-tertiary/20 dark:bg-primary border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all disabled:opacity-50"
                        placeholder="Ciudad, País"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Sitio Web</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-6 py-4 bg-tertiary/20 dark:bg-primary border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all disabled:opacity-50"
                      placeholder="https://tusitio.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Biografía</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-6 py-4 bg-tertiary/20 dark:bg-primary border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all resize-none disabled:opacity-50"
                      placeholder="Cuéntale al mundo sobre tus gustos gaming..."
                    />
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 pt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-all shadow-xl shadow-purple-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-10 py-5 bg-surface border border-themed text-primary hover:bg-tertiary rounded-full font-bold transition-all active:scale-95"
                      >
                        Descartar
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-12">
                <div className="border-b border-themed/40 pb-8">
                  <h2 className="text-3xl font-bold text-primary tracking-tight">Seguridad de Cuenta</h2>
                  <p className="text-secondary mt-1">Protege tu acceso y configura medidas adicionales.</p>
                </div>
                
                {/* Password Management */}
                <div className="bg-surface rounded-[2.5rem] border border-themed/60 p-8 sm:p-10 shadow-xl shadow-purple-500/5">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                        <i className="fas fa-key text-xl"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-primary">Contraseña</h3>
                        <p className="text-sm text-secondary">Último cambio: Hace 3 meses</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsChangingPassword(!isChangingPassword)}
                      className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                        isChangingPassword 
                          ? 'bg-surface border border-themed text-primary hover:bg-tertiary' 
                          : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
                      }`}
                    >
                      {isChangingPassword ? 'Cerrar' : 'Actualizar'}
                    </button>
                  </div>

                  {isChangingPassword && (
                    <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Contraseña Actual</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-tertiary/20 dark:bg-primary border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all"
                          required
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Nueva Contraseña</label>
                          <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="w-full px-6 py-4 bg-tertiary/20 dark:bg-primary border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Confirmar Nueva</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-6 py-4 bg-tertiary/20 dark:bg-primary border border-themed/40 rounded-2xl text-primary focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all"
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-purple-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-shield-check"></i>}
                        {loading ? 'Procesando...' : 'Confirmar Cambio de Contraseña'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Additional Security Toggles */}
                <div className="space-y-4">
                  {[
                    { key: 'twoFactorAuth', label: 'Autenticación 2FA', desc: 'Añade una capa de protección adicional.', icon: 'mobile-screen' },
                    { key: 'loginAlerts', label: 'Alertas de Acceso', desc: 'Notificarme sobre inicios de sesión inusuales.', icon: 'bell' },
                    { key: 'deviceHistory', label: 'Historial de Sesiones', desc: 'Mantener registro de dispositivos vinculados.', icon: 'laptop-code' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-6 bg-surface border border-themed/60 rounded-3xl hover:border-purple-500/30 transition-all group">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-tertiary/20 flex items-center justify-center text-muted group-hover:text-purple-600 transition-colors">
                          <i className={`fas fa-${item.icon}`}></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-primary">{item.label}</h4>
                          <p className="text-xs text-secondary">{item.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings[item.key]}
                          onChange={(e) => handleSecurityChange(item.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-tertiary/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 shadow-inner"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-12">
                <div className="border-b border-themed/40 pb-8">
                  <h2 className="text-3xl font-bold text-primary tracking-tight">Preferencias</h2>
                  <p className="text-secondary mt-1">Personaliza tu experiencia visual y notificaciones.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Theme & Lang Card */}
                  <div className="bg-surface rounded-[2.5rem] border border-themed/60 p-8 shadow-xl shadow-purple-500/5 space-y-8">
                    <h3 className="text-xl font-bold text-primary flex items-center gap-3">
                      <i className="fas fa-palette text-purple-600"></i>
                      Apariencia
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Tema Visual</label>
                        <div className="relative group">
                          <select
                            value={preferences.theme}
                            onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                            className="w-full px-6 py-4 bg-tertiary/20 dark:bg-primary/50 border border-themed/40 rounded-2xl text-primary font-bold text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/5 appearance-none transition-all cursor-pointer !bg-none"
                            style={{ backgroundColor: 'var(--bg-primary)' }}
                          >
                            <option value="light" className="bg-primary text-primary">☀️ Modo Claro</option>
                            <option value="dark" className="bg-primary text-primary">🌙 Modo Oscuro</option>
                            <option value="auto" className="bg-primary text-primary">🖥️ Sistema</option>
                          </select>
                          <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-muted pointer-events-none text-xs group-hover:text-purple-600 transition-colors"></i>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Idioma de Interfaz</label>
                        <div className="relative group">
                          <select
                            value={preferences.language}
                            onChange={(e) => handlePreferenceChange('language', e.target.value)}
                            className="w-full px-6 py-4 bg-tertiary/20 dark:bg-primary/50 border border-themed/40 rounded-2xl text-primary font-bold text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/5 appearance-none transition-all cursor-pointer !bg-none"
                            style={{ backgroundColor: 'var(--bg-primary)' }}
                          >
                            <option value="es" className="bg-primary text-primary">🇪🇸 Español</option>
                            <option value="en" className="bg-primary text-primary">🇺🇸 English</option>
                            <option value="fr" className="bg-primary text-primary">🇫🇷 Français</option>
                          </select>
                          <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-muted pointer-events-none text-xs group-hover:text-purple-600 transition-colors"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notifications Card */}
                  <div className="bg-surface rounded-[2.5rem] border border-themed/60 p-8 shadow-xl shadow-purple-500/5 space-y-8">
                    <h3 className="text-xl font-bold text-primary flex items-center gap-3">
                      <i className="fas fa-bell text-purple-600"></i>
                      Notificaciones
                    </h3>
                    <div className="space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'Email', icon: 'at' },
                        { key: 'pushNotifications', label: 'Push', icon: 'bolt' },
                        { key: 'marketingEmails', label: 'News', icon: 'paper-plane' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-tertiary/20 dark:bg-primary border border-themed/30 rounded-2xl transition-colors">
                          <div className="flex items-center gap-3">
                            <i className={`fas fa-${item.icon} text-muted text-xs`}></i>
                            <span className="text-sm font-bold text-secondary">{item.label}</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences[item.key]}
                              onChange={(e) => handlePreferenceChange(item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-themed/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Privacy Selection */}
                <div className="bg-surface rounded-[2.5rem] border border-themed/60 p-8 shadow-xl shadow-purple-500/5">
                  <h3 className="text-xl font-bold text-primary mb-8 flex items-center gap-3">
                    <i className="fas fa-eye-slash text-purple-600"></i>
                    Visibilidad y Privacidad
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { value: 'public', label: 'Público', icon: 'globe', desc: 'Todos ven tu perfil' },
                      { value: 'friends', label: 'Amigos', icon: 'user-group', desc: 'Solo tus contactos' },
                      { value: 'private', label: 'Privado', icon: 'lock', desc: 'Oculto para todos' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handlePreferenceChange('privacy', opt.value)}
                        className={`p-6 rounded-3xl border-2 transition-all text-left space-y-3 ${
                          preferences.privacy === opt.value
                            ? 'border-purple-600 bg-purple-600/10 dark:bg-purple-600/20'
                            : 'border-themed/40 hover:border-purple-500/30 bg-tertiary/10 dark:bg-primary/50'
                        }`}
                      >
                        <i className={`fas fa-${opt.icon} ${preferences.privacy === opt.value ? 'text-purple-600' : 'text-muted'}`}></i>
                        <div>
                          <div className={`font-bold text-sm ${preferences.privacy === opt.value ? 'text-purple-600' : 'text-primary'}`}>{opt.label}</div>
                          <div className="text-[10px] font-medium text-secondary">{opt.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10">
                <div className="border-b border-themed/40 pb-8">
                  <h2 className="text-3xl font-bold text-primary tracking-tight">Actividad Reciente</h2>
                  <p className="text-secondary mt-1">Monitorea los accesos y cambios realizados en tu cuenta.</p>
                </div>
                
                <div className="space-y-4">
                  {activityLog.length > 0 ? (
                    activityLog.map((activity, index) => {
                      const getActivityIcon = (action) => {
                        if (action.includes('Perfil')) return 'user-pen';
                        if (action.includes('Contraseña')) return 'key';
                        if (action.includes('Login') || action.includes('sesión')) return 'right-to-bracket';
                        if (action.includes('Email')) return 'envelope';
                        return 'circle-info';
                      };

                      const getActivityColor = (action) => {
                        if (action.includes('Perfil')) return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
                        if (action.includes('Contraseña')) return 'text-green-500 bg-green-50 dark:bg-green-900/20';
                        if (action.includes('Login')) return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
                        return 'text-muted bg-tertiary/50';
                      };

                      const timeAgo = (timestamp) => {
                        const now = new Date();
                        const activityTime = new Date(timestamp);
                        const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
                        if (diffInMinutes < 1) return 'Ahora mismo';
                        if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
                        if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
                        return activityTime.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                      };

                      return (
                        <div key={index} className="flex items-center gap-6 p-6 bg-surface border border-themed/60 rounded-3xl hover:border-purple-500/20 transition-all group">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getActivityColor(activity.action)} group-hover:scale-105 transition-transform`}>
                            <i className={`fas fa-${getActivityIcon(activity.action)} text-lg`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-primary truncate text-sm">{activity.action}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-1.5">
                                <i className="fas fa-clock text-[9px] opacity-50"></i>
                                {timeAgo(activity.timestamp)}
                              </span>
                              {activity.ip && activity.ip !== 'Unknown' && (
                                <span className="text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-1.5">
                                  <i className="fas fa-network-wired text-[9px] opacity-50"></i>
                                  {activity.ip}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-20 bg-secondary/10 rounded-[3rem] border border-dashed border-themed/60">
                      <div className="w-16 h-16 rounded-full bg-surface border border-themed flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <i className="fas fa-clock-rotate-left text-xl text-muted"></i>
                      </div>
                      <h3 className="text-lg font-bold text-primary mb-2">Sin actividad reciente</h3>
                      <p className="text-secondary text-sm">Tu historial de acciones aparecerá aquí.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Support CTA */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-purple-600 rounded-[3rem] p-10 sm:p-16 text-white shadow-2xl shadow-purple-600/30 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center md:text-left">
              <h3 className="text-3xl font-bold mb-4 tracking-tight">¿Necesitas ayuda con tu cuenta?</h3>
              <p className="text-lg text-purple-100 opacity-90">Nuestro equipo está disponible para resolver cualquier duda técnica o problema con tu perfil.</p>
            </div>
            <Link 
              to="/contact" 
              className="px-10 py-5 bg-white text-purple-600 rounded-full font-black text-xs uppercase tracking-widest hover:bg-purple-50 transition-all shadow-2xl active:scale-95 flex items-center gap-3 shrink-0"
            >
              <i className="fas fa-headset text-lg"></i>
              Contactar Soporte
            </Link>
          </div>
          {/* Abstract Design Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;