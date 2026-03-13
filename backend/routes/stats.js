import express from 'express';
import { getAppStats, getDetailedStats } from '../controllers/statsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Ruta pública para estadísticas básicas (Login/Register)
router.get('/', getAppStats);

// Ruta protegida para estadísticas detalladas (solo admin)
router.get('/detailed', authenticateToken, getDetailedStats);

export default router;
