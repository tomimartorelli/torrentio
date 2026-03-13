import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';

const Contact = () => {
  const { t } = useTheme();
  const { showSuccess, showError } = useNotification();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'general', label: 'Consulta General', icon: 'fas fa-question-circle' },
    { value: 'technical', label: 'Soporte Técnico', icon: 'fas fa-tools' },
    { value: 'business', label: 'Colaboración', icon: 'fas fa-handshake' },
    { value: 'bug', label: 'Reportar Error', icon: 'fas fa-bug' },
    { value: 'feature', label: 'Sugerir Función', icon: 'fas fa-lightbulb' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'El asunto es requerido';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Por favor, corrige los errores en el formulario');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simular envío de formulario (aquí puedes integrar con tu backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccess('¡Mensaje enviado exitosamente! Te responderemos pronto.');
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
      
    } catch (error) {
      showError('Error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      value: 'contacto@torrentio.com',
      link: 'mailto:contacto@torrentio.com',
      color: 'text-blue-600'
    },
    {
      icon: 'fas fa-phone',
      title: 'Teléfono',
      value: '+54 11 1234-5678',
      link: 'tel:+541112345678',
      color: 'text-green-600'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Ubicación',
      value: 'Buenos Aires, Argentina',
      link: '#',
      color: 'text-red-600'
    },
    {
      icon: 'fas fa-clock',
      title: 'Horario',
      value: 'Lun - Vie: 9:00 - 18:00',
      link: '#',
      color: 'text-purple-600'
    }
  ];

  const socialLinks = [
    {
      name: 'Discord',
      icon: 'fab fa-discord',
      url: '#',
      color: 'hover:text-indigo-600',
      bgColor: 'hover:bg-indigo-100'
    },
    {
      name: 'Twitter',
      icon: 'fab fa-twitter',
      url: '#',
      color: 'hover:text-blue-600',
      bgColor: 'hover:bg-blue-100'
    },
    {
      name: 'GitHub',
      icon: 'fab fa-github',
      url: '#',
      color: 'hover:text-gray-600',
      bgColor: 'hover:bg-gray-100'
    },
    {
      name: 'YouTube',
      icon: 'fab fa-youtube',
      url: '#',
      color: 'hover:text-red-600',
      bgColor: 'hover:bg-red-100'
    }
  ];

  return (
    <div className="min-h-screen bg-primary font-neue-haas">
      {/* Header Section */}
      <div className="bg-secondary/30 border-b border-themed/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted mb-8">
            <Link to="/" className="hover:text-purple-600 transition-colors flex items-center gap-1.5">
              <i className="fas fa-house text-[10px]"></i>
              <span>Inicio</span>
            </Link>
            <i className="fas fa-chevron-right text-[8px] opacity-30"></i>
            <span className="text-primary flex items-center gap-1.5">
              <span>Soporte</span>
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4 tracking-tight">
                Estamos para <span className="text-purple-600">Ayudarte</span>
              </h1>
              <p className="text-lg text-secondary leading-relaxed">
                ¿Tienes alguna duda o necesitas asistencia técnica? Nuestro equipo especializado está listo para brindarte soporte personalizado.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-10 border-l border-themed/50 pl-10 hidden lg:flex">
              <div>
                <div className="text-3xl font-bold text-primary">24h</div>
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Respuesta</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">99%</div>
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Contact Form Container */}
          <div className="lg:col-span-8">
            <div className="bg-surface rounded-[2.5rem] border border-themed/60 p-10 shadow-2xl shadow-purple-500/5">
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-primary mb-3">Envíanos un mensaje</h2>
                <p className="text-secondary">Completa los campos a continuación y nos pondremos en contacto a la brevedad.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Category Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-4">
                    ¿Cuál es el motivo de tu consulta?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                        className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left flex flex-col gap-3 group ${
                          formData.category === category.value
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/10'
                            : 'border-themed/40 hover:border-purple-300 bg-surface'
                        }`}
                      >
                        <i className={`${category.icon} text-lg ${
                          formData.category === category.value ? 'text-purple-600' : 'text-muted group-hover:text-purple-400'
                        }`}></i>
                        <span className={`text-sm font-bold ${
                          formData.category === category.value ? 'text-purple-600' : 'text-primary'
                        }`}>
                          {category.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fields Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-4 bg-tertiary/30 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm ${
                        errors.name ? 'border-red-500' : 'border-themed/60'
                      }`}
                      placeholder="Ej. Juan Pérez"
                    />
                    {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-4 bg-tertiary/30 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm ${
                        errors.email ? 'border-red-500' : 'border-themed/60'
                      }`}
                      placeholder="tu@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">
                    Asunto de la consulta
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 bg-tertiary/30 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm ${
                      errors.subject ? 'border-red-500' : 'border-themed/60'
                    }`}
                    placeholder="¿En qué podemos ayudarte?"
                  />
                  {errors.subject && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.subject}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">
                    Tu Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-5 py-4 bg-tertiary/30 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/30 transition-all text-sm resize-none ${
                      errors.message ? 'border-red-500' : 'border-themed/60'
                    }`}
                    placeholder="Cuéntanos más detalles sobre tu solicitud..."
                  />
                  <div className="flex justify-between items-center mt-2 px-1">
                    {errors.message ? (
                      <p className="text-red-500 text-[10px] font-bold">{errors.message}</p>
                    ) : (
                      <span></span>
                    )}
                    <span className="text-[10px] font-bold text-muted">{formData.message.length}/500</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-purple-600/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <i className="fas fa-paper-plane text-sm"></i>
                      <span>Enviar Mensaje</span>
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Information */}
          <div className="lg:col-span-4 space-y-10">
            {/* Direct Contact */}
            <div className="bg-surface rounded-[2.5rem] border border-themed/60 p-8">
              <h3 className="text-xl font-bold text-primary mb-8 tracking-tight">Contacto Directo</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    className="flex items-center gap-5 p-4 rounded-2xl hover:bg-tertiary transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center ${info.color} group-hover:scale-110 transition-transform duration-300`}>
                      <i className={`${info.icon} text-lg`}></i>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-muted uppercase tracking-widest">{info.title}</div>
                      <div className="text-sm font-bold text-primary group-hover:text-purple-600 transition-colors">{info.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Social Connect */}
            <div className="bg-surface rounded-[2.5rem] border border-themed/60 p-8">
              <h3 className="text-xl font-bold text-primary mb-8 tracking-tight">Redes Sociales</h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-themed/40 transition-all duration-300 hover:border-transparent ${social.bgColor} ${social.color} group`}
                  >
                    <i className={`${social.icon} text-2xl group-hover:scale-110 transition-transform`}></i>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Support Card */}
            <div className="bg-purple-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4">Soporte Prioritario</h3>
                <p className="text-sm text-purple-100 mb-8 leading-relaxed">
                  ¿Eres usuario Premium? Accede a nuestro canal de Discord exclusivo para soporte técnico inmediato.
                </p>
                <a href="#" className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-full font-bold text-sm hover:bg-purple-50 transition-all shadow-lg">
                  <i className="fab fa-discord"></i>
                  Ir a Discord
                </a>
              </div>
              {/* Abstract Design Elements */}
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -left-4 -top-4 w-20 h-20 bg-purple-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
