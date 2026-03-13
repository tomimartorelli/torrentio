import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { useAppStats } from '../../hooks/useAppStats';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { t } = useTheme();
  const { formattedStats, loading: statsLoading } = useAppStats();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { email, password } = formData;

    // Validación de email
    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Por favor ingresa un email válido';
    }

    // Validación de contraseña
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 4) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Por favor, corrige los errores en el formulario');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      
      if (response.data.token) {
        login(response.data.token);
        showSuccess('¡Inicio de sesión exitoso! Bienvenido de vuelta.');
        
        // Guardar preferencia de "recordarme"
        if (rememberMe) {
          localStorage.setItem('rememberUser', formData.email);
        } else {
          localStorage.removeItem('rememberUser');
        }
        
        // Pequeño delay para mostrar el mensaje de éxito
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      showError(errorMessage);
      
      // Si hay error de credenciales, enfocar el campo de contraseña
      if (error.response?.status === 401) {
        setErrors({ password: 'Credenciales incorrectas' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar email recordado al montar el componente
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberUser');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 font-neue-haas relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-700">
        {/* Brand Section */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-8 group">
            <div className="w-20 h-20 bg-surface border border-themed/60 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-purple-500/10 group-hover:scale-105 transition-transform duration-500">
              <i className="fas fa-shield-halved text-3xl text-purple-600"></i>
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-primary mb-3 tracking-tight">Bienvenido</h1>
          <p className="text-secondary text-lg">Inicia sesión en tu cuenta de Torrentio</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface rounded-[2.5rem] border border-themed/60 p-10 shadow-2xl shadow-purple-500/5 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">
                Correo Electrónico
              </label>
              <div className="relative group">
                <i className="fas fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-purple-600 transition-colors text-xs"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-5 py-4 bg-tertiary/30 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm ${
                    errors.email ? 'border-red-500' : 'border-themed/60'
                  }`}
                  placeholder="nombre@ejemplo.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 flex items-center gap-1">
                  <i className="fas fa-circle-exclamation"></i>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="text-[10px] font-bold text-muted uppercase tracking-widest">
                  Contraseña
                </label>
                <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-purple-600 hover:text-purple-700 uppercase tracking-widest">
                  ¿La olvidaste?
                </Link>
              </div>
              <div className="relative group">
                <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-purple-600 transition-colors text-xs"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-4 bg-tertiary/30 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm ${
                    errors.password ? 'border-red-500' : 'border-themed/60'
                  }`}
                  placeholder="Tu contraseña secreta"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-purple-600 transition-colors"
                  disabled={isLoading}
                >
                  <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'} text-xs`}></i>
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 flex items-center gap-1">
                  <i className="fas fa-circle-exclamation"></i>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer sr-only"
                  disabled={isLoading}
                />
                <div className="w-5 h-5 border-2 border-themed/60 rounded-lg bg-surface peer-checked:bg-purple-600 peer-checked:border-transparent transition-all"></div>
                <i className="fas fa-check absolute inset-0 flex items-center justify-center text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity"></i>
              </div>
              <span className="text-xs font-bold text-secondary group-hover:text-primary transition-colors">Recordar mi sesión</span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-purple-600/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Autenticando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span>Entrar a Torrentio</span>
                  <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                </div>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="my-10 flex items-center gap-4">
            <div className="h-px bg-themed/40 flex-1"></div>
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">O continúa con</span>
            <div className="h-px bg-themed/40 flex-1"></div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-4 bg-surface border border-themed/60 rounded-2xl hover:bg-tertiary transition-all active:scale-95 group">
              <i className="fab fa-google text-red-500 group-hover:scale-110 transition-transform"></i>
              <span className="text-xs font-bold text-primary">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-4 bg-surface border border-themed/60 rounded-2xl hover:bg-tertiary transition-all active:scale-95 group">
              <i className="fab fa-discord text-indigo-500 group-hover:scale-110 transition-transform"></i>
              <span className="text-xs font-bold text-primary">Discord</span>
            </button>
          </div>

          {/* Footer Link */}
          <p className="mt-10 text-center text-sm text-secondary">
            ¿Nuevo en Torrentio?{' '}
            <Link to="/register" className="text-purple-600 font-bold hover:underline">
              Crea una cuenta gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
