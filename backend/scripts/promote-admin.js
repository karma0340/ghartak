import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const promoteToAdmin = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { returnDocument: 'after' });
        if (user) {
            console.log(`✅ Success! User ${email} is now an ADMIN.`);
        } else {
            console.log(`❌ Error: User with email ${email} not found.`);
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection error:', error);
        process.exit(1);
    }
};

const email = process.argv[2];
if (!email) {
    console.log('Usage: node promote-admin.js <email>');
    process.exit(1);
}

promoteToAdmin(email);
