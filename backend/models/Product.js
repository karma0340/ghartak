import mongoose from 'mongoose';

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

export default mongoose.model('Product', productSchema);