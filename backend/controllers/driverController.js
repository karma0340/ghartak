import DriverProfile from '../models/DriverProfile.js';
import User from '../models/User.js';

// Apply to be a driver
export const registerDriverApplication = async (req, res) => {
    const { userId, vehicleType, vehicleModel, vehicleNumber, licenseNumber } = req.body;
    try {
        const existingProfile = await DriverProfile.findOne({ user: userId });
        if (existingProfile) return res.status(400).json({ error: 'Application already exists' });

        const profile = await DriverProfile.create({
            user: userId,
            vehicleType,
            vehicleModel,
            vehicleNumber,
            licenseNumber,
            status: 'PENDING'
        });

        // Update user role to signify they are in transition? 
        // For now, keep as 'user' but marked as pending
        res.status(201).json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Error submitting application' });
    }
};

// Toggle Online Status
export const toggleOnlineStatus = async (req, res) => {
    const { userId, isOnline, lat, lng } = req.body;
    try {
        const updateData = { isOnline };
        if (lat && lng) updateData.currentLocation = { lat, lng };
        
        const profile = await DriverProfile.findOneAndUpdate(
            { user: userId },
            updateData,
            { returnDocument: 'after' }
        );
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Error updating status' });
    }
};

export const updateLocation = async (req, res) => {
    const { userId, lat, lng } = req.body;
    try {
        const profile = await DriverProfile.findOneAndUpdate(
            { user: userId },
            { currentLocation: { lat, lng } },
            { returnDocument: 'after' }
        );
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Error updating location' });
    }
};

export const getDriverProfile = async (req, res) => {
    try {
        const profile = await DriverProfile.findOne({ user: req.params.userId }).populate('user', 'name email');
        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching driver profile' });
    }
};
