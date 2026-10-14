import express from 'express';
import {
  getUsers,
  updateUserRole,
  toggleUserStatus
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/role.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('ADMIN'));

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', toggleUserStatus);

export default router;
