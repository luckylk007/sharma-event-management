import { Router } from 'express';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protect, adminOnly } from '../middlewares/auth.js';

const router = Router();

router.get('/', getServices);
router.get('/:slug', getService);
router.post('/', protect, adminOnly, createService);
router.put('/:id', protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

export default router;
