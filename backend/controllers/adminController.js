import User from '../models/User.js';
import DriverProfile from '../models/DriverProfile.js';
import Ride from '../models/Ride.js';

// Get all driver applications
export const getDriverApplications = async (req, res) => {
    try {
        const drivers = await DriverProfile.find().populate('user', 'name email');
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching applications' });
    }
};

// Approve or Reject Driver
export const updateDriverStatus = async (req, res) => {
    const { profileId, status } = req.body; // 'APPROVED' or 'REJECTED'
    try {
        const profile = await DriverProfile.findById(profileId);
        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        profile.status = status;
        await profile.save();

        if (status === 'APPROVED') {
            await User.findByIdAndUpdate(profile.user, { 
                role: 'driver',
                isVerified: true 
            });
        }

        res.json({ message: `Driver status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ error: 'Error updating driver status' });
    }
};

// Get Platform Stats
export const getPlatformStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const rideCount = await Ride.countDocuments();
        const driverCount = await DriverProfile.countDocuments({ status: 'APPROVED' });
        
        const rides = await Ride.find({ status: 'COMPLETED' });
        const revenue = rides.reduce((acc, ride) => acc + ride.price, 0);

        res.json({ userCount, rideCount, driverCount, revenue });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stats' });
    }
};
