import express from 'express';
import { 
  createUser, 
  getAllUsers, 
  getUserByName, 
  updateUser, 
  deleteUser, 
  loginUser, 
  updateProfile, 
  changePassword,
  updatePreferences,
  updateSecuritySettings,
  getUserActivity,
  logUserActivity
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';

const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.post('/login', loginUser);

// Rutas protegidas que requieren autenticación
router.put('/profile', authenticateToken, uploadAvatar.single('avatar'), updateProfile);
router.put('/change-password', authenticateToken, changePassword);
router.put('/preferences', authenticateToken, updatePreferences);
router.put('/security-settings', authenticateToken, updateSecuritySettings);
router.get('/activity', authenticateToken, getUserActivity);

router.get('/name/:name', getUserByName);
router.put('/name/:name', updateUser);
router.delete('/name/:name', deleteUser);

export default router;
