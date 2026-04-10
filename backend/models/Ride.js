import mongoose from 'mongoose';

const rideSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pickup: { type: String, required: true },
    destination: { type: String, required: true },
    pickupCoords: { 
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    destinationCoords: { 
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    rideType: { type: String, default: 'cab' },
    distance: { type: Number },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { 
        type: String, 
        enum: ['PENDING', 'ACCEPTED', 'ARRIVING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], 
        default: 'PENDING' 
    },
    price: { type: Number, required: true },
    cancelReason: { type: String },
    otp: { type: String }
}, { timestamps: true });

export default mongoose.model('Ride', rideSchema);