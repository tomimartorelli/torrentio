// routes/developers.js
import express from 'express';
import {
  createDeveloper,
  getAllDevelopers,
  getDeveloperById,
  updateDeveloper,
  deleteDeveloper
} from '../controllers/developerController.js';

const router = express.Router();

router.post('/', createDeveloper);
router.get('/', getAllDevelopers);
router.get('/:name', getDeveloperById);
router.put('/:name', updateDeveloper);
router.delete('/:name', deleteDeveloper);

export default router;
