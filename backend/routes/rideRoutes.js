import express from 'express';
import { 
    createRide, 
    getNearbyRides, 
    acceptRide, 
    updateRideStatus, 
    getRideStatus,
    updateRidePrice,
    cancelRide,
    sendChatMessage,
    getChatMessages,
    getActiveRide
} from '../controllers/rideController.js';

const router = express.Router();

router.route('/active').get(getActiveRide);
router.route('/').post(createRide);
router.route('/nearby').get(getNearbyRides);
router.route('/accept').put(acceptRide);
router.route('/status').put(updateRideStatus);
router.route('/price').put(updateRidePrice);
router.route('/cancel').put(cancelRide);
router.route('/:id/chat').get(getChatMessages).post(sendChatMessage);
router.route('/:id').get(getRideStatus);

export default router;