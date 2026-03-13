import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { useAppStats } from '../../hooks/useAppStats';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { t } = useTheme();
  const { formattedStats, loading: statsLoading, developers } = useAppStats();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({ ...formData, [name]: newValue });
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Calcular fuerza de contraseña en tiempo real
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    setPasswordStrength(Math.min(strength, 100));
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return { text: 'Muy débil', color: 'text-red-500' };
    if (passwordStrength < 50) return { text: 'Débil', color: 'text-orange-500' };
    if (passwordStrength < 75) return { text: 'Buena', color: 'text-yellow-500' };
    return { text: 'Fuerte', color: 'text-green-500' };
  };

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { name, email, password, confirmPassword, acceptTerms } = formData;

    // Validación de nombre
    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (!nameRegex.test(name)) {
      newErrors.name = 'El nombre debe tener entre 2-50 caracteres y solo letras';
    }

    // Validación de email
    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Por favor ingresa un email válido';
    }

    // Validación de contraseña
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validación de confirmación de contraseña
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validación de términos
    if (!acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
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
      const { confirmPassword, acceptTerms, ...registerData } = formData;
      const response = await axios.post("http://localhost:5000/api/users", registerData);
      
      if (response.status === 201) {
        showSuccess('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
        
        // Pequeño delay antes de redirigir
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error al registrar el usuario";
      showError(errorMessage);
      
      // Si hay error de email duplicado, resaltar el campo
      if (error.response?.status === 400 && errorMessage.includes('email')) {
        setErrors({ email: 'Este email ya está registrado' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const strengthData = getPasswordStrengthText();

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 font-neue-haas relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative w-full max-w-[520px] animate-in fade-in zoom-in-95 duration-700">
        {/* Brand Section */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-8 group">
            <div className="w-20 h-20 bg-surface border border-themed/60 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-purple-500/10 group-hover:scale-105 transition-transform duration-500">
              <i className="fas fa-user-plus text-3xl text-purple-600"></i>
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-primary mb-3 tracking-tight">Únete a la Élite</h1>
          <p className="text-secondary text-lg">Crea tu cuenta profesional en Torrentio</p>
        </div>

        {/* Register Card */}
        <div className="bg-surface rounded-[2.5rem] border border-themed/60 p-10 shadow-2xl shadow-purple-500/5 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">
                Nombre Completo
              </label>
              <div className="relative group">
                <i className="fas fa-user absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-purple-600 transition-colors text-xs"></i>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-5 py-4 bg-tertiary/30 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm ${
                    errors.name ? 'border-red-500' : 'border-themed/60'
                  }`}
                  placeholder="Tu nombre y apellido"
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 flex items-center gap-1">
                  <i className="fas fa-circle-exclamation"></i>
                  {errors.name}
                </p>
              )}
            </div>

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

            {/* Passwords Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">
                  Contraseña
                </label>
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
                    placeholder="Contraseña"
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
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">
                  Confirmar
                </label>
                <div className="relative group">
                  <i className="fas fa-shield-check absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-purple-600 transition-colors text-xs"></i>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-4 bg-tertiary/30 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm ${
                      errors.confirmPassword ? 'border-red-500' : 'border-themed/60'
                    }`}
                    placeholder="Repetir"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-purple-600 transition-colors"
                    disabled={isLoading}
                  >
                    <i className={`fas fa-${showConfirmPassword ? 'eye-slash' : 'eye'} text-xs`}></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Seguridad</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${strengthData.color}`}>
                    {strengthData.text}
                  </span>
                </div>
                <div className="w-full bg-tertiary/50 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      passwordStrength < 25 ? 'bg-red-500' :
                      passwordStrength < 50 ? 'bg-orange-500' :
                      passwordStrength < 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
            )}

            {(errors.password || errors.confirmPassword) && (
              <p className="text-red-500 text-[10px] font-bold px-1 flex items-center gap-1">
                <i className="fas fa-circle-exclamation"></i>
                {errors.password || errors.confirmPassword}
              </p>
            )}

            {/* Terms and Conditions */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="peer sr-only"
                    disabled={isLoading}
                  />
                  <div className="w-5 h-5 border-2 border-themed/60 rounded-lg bg-surface peer-checked:bg-purple-600 peer-checked:border-transparent transition-all"></div>
                  <i className="fas fa-check absolute inset-0 flex items-center justify-center text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                </div>
                <span className="text-xs text-secondary group-hover:text-primary transition-colors leading-relaxed">
                  He leído y acepto los <Link to="/terms" className="text-purple-600 font-bold hover:underline">términos de servicio</Link> y las <Link to="/privacy" className="text-purple-600 font-bold hover:underline">políticas de privacidad</Link>.
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-red-500 text-[10px] font-bold px-1 flex items-center gap-1">
                  <i className="fas fa-circle-exclamation"></i>
                  {errors.acceptTerms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-purple-600/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Creando Perfil...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span>Comenzar mi Aventura</span>
                  <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                </div>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-10 text-center text-sm text-secondary">
            ¿Ya eres miembro?{' '}
            <Link to="/login" className="text-purple-600 font-bold hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
