import express from 'express';
import {
  getStats,
  getCoverageGaps,
  getMapData
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/role.js';

const router = express.Router();

router.use(protect);

router.get(
  '/stats',
  authorizeRoles('NGO', 'VOLUNTEER', 'GOVERNMENT', 'ADMIN'),
  getStats
);

router.get(
  '/coverage',
  authorizeRoles('GOVERNMENT', 'ADMIN', 'NGO'),
  getCoverageGaps
);

router.get('/map', getMapData);

export default router;
