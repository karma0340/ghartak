import Order from '../models/Order.js';
import User from '../models/User.js';

export const createOrder = async (req, res) => {
    let { userId, items, total } = req.body;
    try {
        if (userId === 'guest-user') {
            let guest = await User.findOne({ email: 'guest@ghartk.com' });
            if (!guest) guest = await User.create({ name: 'Guest', email: 'guest@ghartk.com', password: 'guest' });
            userId = guest._id;
        }

        const formattedItems = items.map(item => ({
            product: item.productId,
            quantity: item.quantity
        }));

        const order = await Order.create({ user: userId, total, items: formattedItems });
        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating order' });
    }
};