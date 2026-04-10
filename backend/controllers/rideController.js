import Ride from '../models/Ride.js';
import User from '../models/User.js';
import Message from '../models/Message.js';
import mongoose from 'mongoose';

export const createRide = async (req, res) => {
    let { userId, pickup, destination, pickupCoords, destinationCoords, price, rideType, distance } = req.body;
    try {
        if (userId === 'guest-user') {
            let guest = await User.findOne({ email: 'guest@ghartk.com' });
            if (!guest) guest = await User.create({ name: 'Guest', email: 'guest@ghartk.com', password: 'guest' });
            userId = guest._id;
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const ride = await Ride.create({ 
            user: userId, 
            pickup, 
            destination, 
            pickupCoords, 
            destinationCoords, 
            price, 
            rideType, 
            distance,
            otp
        });
        res.status(201).json(ride);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error booking ride' });
    }
};

export const getNearbyRides = async (req, res) => {
    // Fetch only PENDING rides created in the last 10 minutes to avoid stale requests
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    try {
        const rides = await Ride.find({ 
            status: 'PENDING',
            createdAt: { $gte: tenMinutesAgo }
        }).populate('user', 'name');
        res.json(rides);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching nearby rides' });
    }
};

export const acceptRide = async (req, res) => {
    const { rideId, driverId } = req.body;
    try {
        const ride = await Ride.findByIdAndUpdate(
            rideId, 
            { status: 'ACCEPTED', driver: driverId }, 
            { returnDocument: 'after' }
        ).populate('user', 'name').populate('driver', 'name');
        res.json(ride);
    } catch (error) {
        res.status(500).json({ error: 'Error accepting ride' });
    }
};

export const updateRideStatus = async (req, res) => {
    const { rideId, status, otp } = req.body;
    try {
        if (status === 'IN_PROGRESS') {
            const ride = await Ride.findById(rideId);
            if (!ride) return res.status(404).json({ error: 'Ride not found' });
            if (ride.otp !== otp) {
                return res.status(400).json({ error: 'Invalid OTP' });
            }
        }
        
        const updatedRide = await Ride.findByIdAndUpdate(
            rideId, 
            { status }, 
            { returnDocument: 'after' }
        ).populate('user', 'name').populate('driver', 'name phone');
        
        res.json(updatedRide);
    } catch (error) {
        res.status(500).json({ error: 'Error updating ride status' });
    }
};

export const updateRidePrice = async (req, res) => {
    const { rideId, price } = req.body;
    try {
        const ride = await Ride.findByIdAndUpdate(rideId, { price }, { returnDocument: 'after' });
        res.json(ride);
    } catch (error) {
        res.status(500).json({ error: 'Error updating price' });
    }
};

export const cancelRide = async (req, res) => {
    const { rideId, cancelReason } = req.body;
    try {
        const ride = await Ride.findByIdAndUpdate(
            rideId, 
            { status: 'CANCELLED', cancelReason }, 
            { returnDocument: 'after' }
        );
        res.json(ride);
    } catch (error) {
        res.status(500).json({ error: 'Error cancelling ride' });
    }
};

export const sendChatMessage = async (req, res) => {
    const { id: rideId } = req.params;
    const { sender, text } = req.body;
    try {
        const message = await Message.create({ ride: rideId, sender, text });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Error sending message' });
    }
};

export const getChatMessages = async (req, res) => {
    const { id: rideId } = req.params;
    try {
        const messages = await Message.find({ ride: rideId }).sort('createdAt');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
};

export const getActiveRide = async (req, res) => {
    const { userId, role } = req.query;
    try {
        // Safely cast userId to ObjectId to avoid silent query failures
        let userObjectId;
        try { userObjectId = new mongoose.Types.ObjectId(userId); } catch(e) {
            return res.json(null);
        }
        const query = {
            status: { $in: ['PENDING', 'ACCEPTED', 'ARRIVING', 'IN_PROGRESS'] }
        };
        if (role === 'driver') {
            query.driver = userObjectId;
        } else {
            query.user = userObjectId;
        }
        const ride = await Ride.findOne(query)
            .populate('user', 'name')
            .populate('driver', 'name phone');
        res.json(ride || null);
    } catch (error) {
        console.error('getActiveRide error:', error);
        res.status(500).json({ error: 'Error fetching active ride' });
    }
};

export const getRideStatus = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id)
            .populate('user', 'name')
            .populate('driver', 'name');
        res.json(ride);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching ride status' });
    }
};