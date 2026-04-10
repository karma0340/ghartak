import User from '../models/User.js';

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            res.json({ 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                isVerified: user.isVerified 
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};

export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: 'User already exists' });

        const user = await User.create({ 
            name, 
            email, 
            password, 
            role: role || 'user' 
        });
        res.status(201).json({ 
            id: user._id, 
            name: user.name, 
            email: user.email, 
            role: user.role, 
            isVerified: user.isVerified 
        });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
};