import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');

// 1. Create frontend folder and move client files
if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
}

// Copy and delete to avoid EBUSY on running processes
const filesToMove = ['src', 'public', 'index.html', 'vite.config.js', 'package.json', 'eslint.config.js', 'package-lock.json', '.gitignore'];

function copyRecursiveSync(src, dest) {
    var exists = fs.existsSync(src);
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

for (const file of filesToMove) {
    const oldPath = path.join(rootDir, file);
    const newPath = path.join(frontendDir, file);
    if (fs.existsSync(oldPath)) {
        try {
            fs.renameSync(oldPath, newPath);
        } catch (e) {
            console.log(`Rename failed for ${file}, trying copy...`);
            try {
                copyRecursiveSync(oldPath, newPath);
                // Cannot delete easily if locked, but we copied it.
            } catch (err) {
                console.log(`Failed to copy ${file}:`, err);
            }
        }
    }
}

// 2. Setup backend architecture folders
const dirs = ['config', 'models', 'controllers', 'routes'];
for (const dir of dirs) {
    fs.mkdirSync(path.join(backendDir, dir), { recursive: true });
}

// 3. Write backend files
const files = {
    'config/db.js': `import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ghartk');
        console.log(\`MongoDB Connected: \${conn.connection.host}\`);
    } catch (error) {
        console.error(\`Error: \${error.message}\`);
        process.exit(1);
    }
};
export default connectDB;`,

    'models/User.js': `import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);`,

    'models/Product.js': `import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String, enum: ['FOOD', 'GROCERY'], required: true },
    restaurant: { type: String },
    rating: { type: Number },
    time: { type: String }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);`,

    'models/Order.js': `import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    total: { type: Number, required: true },
    status: { type: String, default: 'PENDING' },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 }
    }]
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);`,

    'models/Ride.js': `import mongoose from 'mongoose';

const rideSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pickup: { type: String, required: true },
    destination: { type: String, required: true },
    driver: { type: String },
    status: { type: String, default: 'PENDING' },
    price: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Ride', rideSchema);`,

    'controllers/userController.js': `import User from '../models/User.js';

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            res.json({ id: user._id, name: user.name, email: user.email });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: 'User already exists' });

        const user = await User.create({ name, email, password });
        res.status(201).json({ id: user._id, name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
};`,

    'controllers/productController.js': `import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
    const { category } = req.query;
    try {
        const query = category ? { category } : {};
        const products = await Product.find(query);
        // Rename _id to id for frontend compatibility
        const mappedProducts = products.map(p => {
            const obj = p.toObject();
            obj.id = obj._id;
            return obj;
        });
        res.json(mappedProducts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
};`,

    'controllers/orderController.js': `import Order from '../models/Order.js';
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
};`,

    'controllers/rideController.js': `import Ride from '../models/Ride.js';
import User from '../models/User.js';

export const createRide = async (req, res) => {
    let { userId, pickup, destination, price } = req.body;
    try {
        if (userId === 'guest-user') {
            let guest = await User.findOne({ email: 'guest@ghartk.com' });
            if (!guest) guest = await User.create({ name: 'Guest', email: 'guest@ghartk.com', password: 'guest' });
            userId = guest._id;
        }
        const ride = await Ride.create({ user: userId, pickup, destination, price });
        res.status(201).json(ride);
    } catch (error) {
        res.status(500).json({ error: 'Error booking ride' });
    }
};`,

    'routes/userRoutes.js': `import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';
const router = express.Router();
router.post('/login', loginUser);
router.post('/register', registerUser);
export default router;`,

    'routes/productRoutes.js': `import express from 'express';
import { getProducts } from '../controllers/productController.js';
const router = express.Router();
router.route('/').get(getProducts);
export default router;`,

    'routes/orderRoutes.js': `import express from 'express';
import { createOrder } from '../controllers/orderController.js';
const router = express.Router();
router.route('/').post(createOrder);
export default router;`,

    'routes/rideRoutes.js': `import express from 'express';
import { createRide } from '../controllers/rideController.js';
const router = express.Router();
router.route('/').post(createRide);
export default router;`,

    'server.js': `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import rideRoutes from './routes/rideRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/rides', rideRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});`,

    'seed.js': `import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';
import Ride from './models/Ride.js';
import connectDB from './config/db.js';

dotenv.config();

const seedDB = async () => {
    await connectDB();
    try {
        // Clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Order.deleteMany();
        await Ride.deleteMany();

        const foods = [
            { name: "Pizza Palace", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60", description: "Italian • Pizza", price: 299, category: "FOOD", time: "25-30 min" },
            { name: "Burger King", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&auto=format&fit=crop&q=60", description: "Fast Food • Burgers", price: 199, category: "FOOD", time: "25-30 min" },
            { name: "Sushi House", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&auto=format&fit=crop&q=60", description: "Japanese • Sushi", price: 599, category: "FOOD", time: "25-30 min" },
            { name: "Green Garden", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60", description: "Healthy • Salads", price: 249, category: "FOOD", time: "25-30 min" },
            { name: "Pasta Paradise", image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=500&auto=format&fit=crop&q=60", description: "Italian • Pasta", price: 349, category: "FOOD", time: "25-30 min" },
            { name: "Sweet Treats", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&auto=format&fit=crop&q=60", description: "Desserts • Ice Cream", price: 149, category: "FOOD", time: "25-30 min" }
        ];

        const groceries = [
            { name: "Fresh Apples", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=500&auto=format&fit=crop&q=60", description: "1 kg • Fresh", price: 150, category: "GROCERY", time: "10-15 min" },
            { name: "Milk", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60", description: "1 L • Dairy", price: 60, category: "GROCERY", time: "10-15 min" },
            { name: "Bread", image: "https://images.unsplash.com/photo-1595535873420-a59915cdb3bf?w=500&auto=format&fit=crop&q=60", description: "1 Loaf • Bakery", price: 40, category: "GROCERY", time: "10-15 min" },
            { name: "Eggs", image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=60", description: "12 Pack • Free Range", price: 90, category: "GROCERY", time: "10-15 min" },
            { name: "Bananas", image: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?w=500&auto=format&fit=crop&q=60", description: "1 Dozen • Fresh", price: 60, category: "GROCERY", time: "10-15 min" },
            { name: "Rice", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60", description: "5 kg • Basmati", price: 500, category: "GROCERY", time: "10-15 min" }
        ];

        await Product.insertMany([...foods, ...groceries]);
        console.log('MongoDB Seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding DB:', error);
        process.exit(1);
    }
};

seedDB();`
};

for (const [filePath, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(backendDir, filePath), content);
}
console.log('Done organizing MVC architecture!');
