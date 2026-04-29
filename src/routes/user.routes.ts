import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.get('/', userController.listUsers);
router.post('/', userController.createUser);

export default router;
