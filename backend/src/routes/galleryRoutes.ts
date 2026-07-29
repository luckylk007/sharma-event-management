import { Router } from 'express';
import {
  getGallery,
  createGalleryItem,
  uploadGalleryImages,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController.js';
import { protect, adminOnly } from '../middlewares/auth.js';
import { uploadMultiple } from '../middlewares/upload.js';

const router = Router();

router.get('/', getGallery);
router.post('/', protect, adminOnly, createGalleryItem);
router.post('/upload', protect, adminOnly, uploadMultiple, uploadGalleryImages);
router.put('/:id', protect, adminOnly, updateGalleryItem);
router.delete('/:id', protect, adminOnly, deleteGalleryItem);

export default router;
