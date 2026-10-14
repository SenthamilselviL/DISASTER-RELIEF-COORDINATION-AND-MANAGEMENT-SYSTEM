import express from 'express';
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  claimRequest,
  updateRequestStatus
} from '../controllers/requestController.js';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/role.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(createRequest)
  .get(getRequests);

router
  .route('/:id')
  .get(getRequestById)
  .put(updateRequest);

router.post(
  '/:id/claim',
  authorizeRoles('NGO', 'VOLUNTEER', 'ADMIN'),
  claimRequest
);

router.post(
  '/:id/status',
  authorizeRoles('NGO', 'VOLUNTEER', 'GOVERNMENT', 'ADMIN'),
  updateRequestStatus
);

export default router;
