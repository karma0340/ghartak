import express from 'express';
import { createOrder } from '../controllers/orderController.js';
const router = express.Router();
router.route('/').post(createOrder);
export default router;