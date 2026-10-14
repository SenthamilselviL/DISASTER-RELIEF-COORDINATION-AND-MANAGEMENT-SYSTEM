import express from 'express';
import { getActivityLogs } from '../controllers/activityController.js';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/role.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('GOVERNMENT', 'ADMIN'));

router.get('/', getActivityLogs);

export default router;
