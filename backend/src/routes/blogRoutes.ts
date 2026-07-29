import { Router } from 'express';
import {
  getBlogs,
  getBlog,
  getBlogSidebar,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import { protect, adminOnly } from '../middlewares/auth.js';

const router = Router();

router.get('/', getBlogs);
router.get('/sidebar/data', getBlogSidebar);
router.get('/:slug', getBlog);
router.post('/', protect, adminOnly, createBlog);
router.put('/:id', protect, adminOnly, updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

export default router;
