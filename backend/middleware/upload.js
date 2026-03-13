import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Crear directorio si no existe
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configuración de almacenamiento para avatares
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/avatars/';
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Crear nombre único con timestamp y user ID
    const userId = req.user.id;
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `avatar_${userId}_${timestamp}${extension}`;
    cb(null, filename);
  }
});

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
  // Permitir solo imágenes
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

// Configuración de multer para avatares
export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  }
});

// Función para eliminar avatar anterior
export const deleteOldAvatar = (avatarPath) => {
  if (avatarPath && fs.existsSync(avatarPath)) {
    try {
      fs.unlinkSync(avatarPath);
      console.log('Avatar anterior eliminado:', avatarPath);
    } catch (error) {
      console.error('Error al eliminar avatar anterior:', error);
    }
  }
};
