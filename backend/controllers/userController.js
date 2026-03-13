import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { deleteOldAvatar } from '../middleware/upload.js';
import path from 'path';
dotenv.config();

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const getUserByName = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { name: req.params.name }, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ name: req.params.name });
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

// Actualizar perfil del usuario autenticado
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, bio, location, website } = req.body;
    const userId = req.user.id; // Viene del middleware de autenticación

    // Verificar si el email ya existe (excluyendo el usuario actual)
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'El email ya está en uso' });
      }
    }

    const updateData = { name, email, phone, bio, location, website };

    // Si hay un archivo subido, agregar la ruta del avatar
    if (req.file) {
      const currentUser = await User.findById(userId);
      
      // Eliminar avatar anterior si existe
      if (currentUser.avatar) {
        deleteOldAvatar(currentUser.avatar);
      }
      
      updateData.avatar = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Generar nuevo token con datos actualizados
    const token = jwt.sign(
      { 
        id: updatedUser._id, 
        name: updatedUser.name, 
        email: updatedUser.email, 
        role: updatedUser.role, 
        createdAt: updatedUser.createdAt,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
        location: updatedUser.location,
        website: updatedUser.website,
        avatar: updatedUser.avatar
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Registrar actividad
    await logUserActivity('Perfil actualizado', userId, { 
      fields: Object.keys(updateData),
      ip: req.ip || req.connection.remoteAddress
    });

    res.json({
      message: 'Perfil actualizado correctamente',
      user: updatedUser,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};

// Cambiar contraseña del usuario autenticado
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Buscar al usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
    }

    // Validar nueva contraseña
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    // Hash de la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    // Registrar actividad
    await logUserActivity('Contraseña cambiada', userId, { 
      ip: req.ip || req.connection.remoteAddress
    });

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar contraseña', error: error.message });
  }
};

// Actualizar preferencias del usuario
export const updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    const userId = req.user.id;

    // Usar dot notation para actualizar preferencias anidadas
    const updateObject = {};
    Object.keys(preferences).forEach(key => {
      updateObject[`preferences.${key}`] = preferences[key];
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateObject },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Preferencias actualizadas correctamente',
      preferences: updatedUser.preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Error al actualizar preferencias', error: error.message });
  }
};

// Actualizar configuraciones de seguridad
export const updateSecuritySettings = async (req, res) => {
  try {
    const { securitySettings } = req.body;
    const userId = req.user.id;

    // Usar dot notation para actualizar configuraciones anidadas
    const updateObject = {};
    Object.keys(securitySettings).forEach(key => {
      updateObject[`securitySettings.${key}`] = securitySettings[key];
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateObject },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Configuración de seguridad actualizada correctamente',
      securitySettings: updatedUser.securitySettings
    });
  } catch (error) {
    console.error('Error updating security settings:', error);
    res.status(500).json({ message: 'Error al actualizar configuración de seguridad', error: error.message });
  }
};

// Obtener historial de actividad del usuario
export const getUserActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('activityLog');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      activity: user.activityLog || []
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial de actividad', error: error.message });
  }
};

// Registrar actividad del usuario
export const logUserActivity = async (action, userId, details = {}) => {
  try {
    const activityEntry = {
      action,
      timestamp: new Date(),
      details,
      ip: details.ip || 'Unknown'
    };

    await User.findByIdAndUpdate(
      userId,
      { 
        $push: { 
          activityLog: {
            $each: [activityEntry],
            $slice: -50 // Mantener solo las últimas 50 actividades
          }
        },
        lastLogin: new Date()
      }
    );
  } catch (error) {
    console.error('Error al registrar actividad:', error);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por correo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Comparar la contraseña ingresada con la almacenada (hash)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Registrar la actividad de login
    await logUserActivity('Inicio de sesión', user._id, { 
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    // Generar el JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        createdAt: user.createdAt,
        phone: user.phone,
        bio: user.bio,
        location: user.location,
        website: user.website,
        avatar: user.avatar,
        preferences: user.preferences,
        securitySettings: user.securitySettings
      }, //payload incluyendo createdAt
      process.env.JWT_SECRET, 
      { expiresIn: '24h' } // Expiración del token
    );

    // Devuelve el token junto con la respuesta
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        phone: user.phone,
        bio: user.bio,
        location: user.location,
        website: user.website,
        avatar: user.avatar,
        preferences: user.preferences,
        securitySettings: user.securitySettings
      },
      token, // Devuelve el JWT generado
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};