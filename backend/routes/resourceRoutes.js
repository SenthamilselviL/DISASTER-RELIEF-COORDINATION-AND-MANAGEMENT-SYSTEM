import express from 'express';
import {
  getResources,
  createResource,
  allocateResource
} from '../controllers/resourceController.js';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/role.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getResources)
  .post(authorizeRoles('GOVERNMENT', 'ADMIN'), createResource);

router.post(
  '/:id/allocate',
  authorizeRoles('GOVERNMENT', 'ADMIN'),
  allocateResource
);

export default router;
