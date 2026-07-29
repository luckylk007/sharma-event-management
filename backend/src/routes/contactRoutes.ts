import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  submitContact,
  getContacts,
  updateContactStatus,
  deleteContact,
  exportContacts,
} from '../controllers/contactController.js';
import { protect, adminOnly } from '../middlewares/auth.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many submissions. Please try again later.' },
});

router.post('/', contactLimiter, submitContact);
router.get('/', protect, adminOnly, getContacts);
router.get('/export', protect, adminOnly, exportContacts);
router.put('/:id', protect, adminOnly, updateContactStatus);
router.delete('/:id', protect, adminOnly, deleteContact);

export default router;
