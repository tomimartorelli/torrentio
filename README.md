# 🎮 Torrentio - Gaming Platform (Modern UI/UX)

![Torrentio Logo](/frontend/public/images/TORRENTIO4.png)

**Torrentio** es una plataforma moderna y minimalista diseñada para el descubrimiento y gestión de software de entretenimiento. Este proyecto ha sido transformado desde una base funcional hacia una experiencia de usuario (UX) premium, centrada en la limpieza visual, la velocidad y una estética profesional de software (SaaS).

## ✨ Características Principales

- **Diseño Ultra-Minimalista**: Eliminación total de gradientes pesados en favor de colores sólidos y tipografía de alta gama.
- **Tipografía Premium**: Uso exclusivo de **Neue Haas Display** para una legibilidad y estilo superior.
- **Modo Oscuro Nativo**: Interfaz optimizada para reducir la fatiga visual con un contraste perfecto.
- **Dashboard de Usuario**: Perfil completo con gestión de seguridad, preferencias de privacidad y registro de actividad.
- **Panel Administrativo**: Gestión completa (CRUD) de juegos y estudios desarrolladores.
- **Responsive Design**: Experiencia fluida en dispositivos móviles, tablets y escritorio.
- **Stack Tecnológico**: MERN (MongoDB, Express, React, Node.js) + Tailwind CSS.

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React.js**: Framework principal.
- **Tailwind CSS**: Estilizado moderno y utilitario.
- **React Router Dom**: Navegación fluida entre vistas.
- **Context API**: Gestión de estados globales (Auth, Theme, Notifications).
- **Axios**: Comunicación con el backend.

### Backend
- **Node.js & Express**: Servidor robusto y escalable.
- **MongoDB**: Base de datos NoSQL para flexibilidad de datos.
- **Mongoose**: Modelado de objetos para MongoDB.
- **JWT (JSON Web Tokens)**: Autenticación segura.
- **Bcrypt**: Encriptación de contraseñas.

## 🚀 Instalación y Uso Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/torrentio.git
   cd torrentio
   ```

2. **Configurar el Backend:**
   - Ve a la carpeta `backend/`.
   - Crea un archivo `.env` con:
     ```env
     PORT=5000
     MONGO_URI=tu_mongo_uri
     JWT_SECRET=tu_secreto_jwt
     ```
   - Instala dependencias y arranca:
     ```bash
     npm install
     npm start
     ```

3. **Configurar el Frontend:**
   - Ve a la carpeta `frontend/`.
   - Crea un archivo `.env` con:
     ```env
     REACT_APP_API_URL=http://localhost:5000/api
     ```
   - Instala dependencias y arranca:
     ```bash
     npm install
     npm start
     ```

## 🎨 Filosofía de Diseño

El rediseño de Torrentio se basa en tres pilares:
1. **Claridad**: Menos es más. Espaciado generoso y jerarquía visual clara.
2. **Consistencia**: Radios de borde altos (`rounded-[3rem]`) y componentes modulares.
3. **Profesionalismo**: Una estética que transmite confianza y modernidad tecnológica.

---
Desarrollado con ❤️ para la comunidad gamer.
