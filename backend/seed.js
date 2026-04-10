import mongoose from 'mongoose';
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

seedDB();