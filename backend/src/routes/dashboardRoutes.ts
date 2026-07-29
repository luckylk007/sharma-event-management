import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  getDashboardStats,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  subscribeNewsletter,
  uploadImage,
  getSitemap,
  getRobots,
} from '../controllers/dashboardController.js';
import { protect, adminOnly } from '../middlewares/auth.js';
import { uploadSingle } from '../middlewares/upload.js';

const router = Router();

const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/testimonials', getTestimonials);
router.post('/testimonials', protect, adminOnly, createTestimonial);
router.put('/testimonials/:id', protect, adminOnly, updateTestimonial);
router.delete('/testimonials/:id', protect, adminOnly, deleteTestimonial);
router.post('/newsletter', newsletterLimiter, subscribeNewsletter);
router.post('/upload', protect, adminOnly, uploadSingle, uploadImage);
router.get('/sitemap.xml', getSitemap);
router.get('/robots.txt', getRobots);

export default router;
