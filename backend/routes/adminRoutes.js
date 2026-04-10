import express from 'express';
import { getDriverApplications, updateDriverStatus, getPlatformStats } from '../controllers/adminController.js';

const router = express.Router();

router.get('/drivers', getDriverApplications);
router.post('/drivers/status', updateDriverStatus);
router.get('/stats', getPlatformStats);

export default router;
