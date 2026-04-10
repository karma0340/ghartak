import express from 'express';
import { 
    registerDriverApplication, 
    toggleOnlineStatus, 
    updateLocation, 
    getDriverProfile 
} from '../controllers/driverController.js';

const router = express.Router();

router.post('/apply', registerDriverApplication);
router.post('/status', toggleOnlineStatus);
router.put('/location', updateLocation);
router.get('/profile/:userId', getDriverProfile);

export default router;
