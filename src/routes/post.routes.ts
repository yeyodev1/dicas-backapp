import { Router } from 'express';
import * as postController from '../controllers/post.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

// specific routes BEFORE param routes
router.get('/admin/all', authMiddleware, postController.getAllPosts);

// public
router.get('/', postController.getPublishedPosts);
router.get('/:slug', postController.getPostBySlug);

// auth required
router.post('/', authMiddleware, postController.createPost);
router.put('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);
router.patch('/:id/publish', authMiddleware, requireAdmin, postController.togglePublish);

export default router;
