import { Router } from 'express';
import {
  getSettings,
  getPublicSettings,
  updateSettings,
  getPrivacy,
  getTerms,
} from '../controllers/settingsController.js';
import { protect, adminOnly } from '../middlewares/auth.js';

const router = Router();

router.get('/public', getPublicSettings);
router.get('/privacy', getPrivacy);
router.get('/terms', getTerms);
router.get('/', protect, adminOnly, getSettings);
router.put('/', protect, adminOnly, updateSettings);

export default router;
