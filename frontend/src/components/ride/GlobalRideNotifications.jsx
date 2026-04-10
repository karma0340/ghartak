import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLiveRide } from '../../context/LiveRideContext';
import { BellRing, CheckCircle, Car, MapPin, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const GlobalRideNotifications = () => {
    const { user } = useAuth();
    const { nearbyRides, activeRide, driverProfile, acceptRideRequest } = useLiveRide();
    const navigate = useNavigate();
    const [dismissedRequests, setDismissedRequests] = useState(new Set());
    
    // Track previous status to detect changes for passenger
    const [prevStatus, setPrevStatus] = useState(activeRide?.status);
    const [passengerToast, setPassengerToast] = useState(null);

    // ─── Driver Notifications ───
    // Get the first request that hasn't been dismissed manually
    const pendingRequest = nearbyRides?.find(r => !dismissedRequests.has(r._id));

    const handleAccept = async () => {
        if (!pendingRequest) return;
        const success = await acceptRideRequest(pendingRequest);
        if (success) {
            navigate('/driver'); // Auto-redirect to dashboard when accepted
        }
    };

    const handleReject = () => {
        if (!pendingRequest) return;
        setDismissedRequests(prev => new Set([...prev, pendingRequest._id]));
    };

    // ─── Passenger Notifications ───
    useEffect(() => {
        if (!driverProfile && activeRide && activeRide.status !== prevStatus) {
            const newStatus = activeRide.status;
            setPrevStatus(newStatus);
            
            if (newStatus === 'ACCEPTED') {
                setPassengerToast({ title: 'Captain Assigned!', message: 'Your captain is on the way to you.', icon: <Car className="text-blue-500" /> });
            } else if (newStatus === 'ARRIVING') {
                setPassengerToast({ title: 'Captain Arrived! 📍', message: 'Your captain is at the pickup point.', icon: <CheckCircle className="text-green-500" /> });
            } else if (newStatus === 'IN_PROGRESS') {
                setPassengerToast({ title: 'Trip Started 🚗', message: 'Sit back and enjoy your ride.', icon: <MapPin className="text-orange-500" /> });
            } else if (newStatus === 'COMPLETED') {
                setPassengerToast({ title: 'Trip Completed ✅', message: 'You have reached your destination.', icon: <CheckCircle className="text-green-500" /> });
            }

            const timer = setTimeout(() => setPassengerToast(null), 6000);
            return () => clearTimeout(timer);
        }
        if (!activeRide) setPrevStatus(null);
    }, [activeRide?.status, driverProfile, prevStatus]);

    // Don't render for unauthenticated users
    if (!user) return null;

    return (
        <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-4 pointer-events-none">
            <AnimatePresence>
                {/* DRIVER POPUP: New Ride Request */}
                {driverProfile && pendingRequest && !activeRide && (
                    <motion.div 
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, x: 50 }}
                        className="bg-white p-5 rounded-[2rem] shadow-2xl border border-brand-orange/20 w-80 pointer-events-auto relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange"></div>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 text-brand-orange font-bold text-sm uppercase tracking-widest">
                                <BellRing className="w-5 h-5 animate-bounce" />
                                New Request
                            </div>
                            <div className="text-xl font-bold">₹{pendingRequest.price}</div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Pickup</p>
                                <p className="text-sm font-bold text-gray-900 line-clamp-1">{pendingRequest.pickup ? pendingRequest.pickup.split(',')[0] : 'Current Location'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Dropoff</p>
                                <p className="text-sm font-bold text-gray-900 line-clamp-1">{pendingRequest.destination ? pendingRequest.destination.split(',')[0] : 'Selected Destination'}</p>
                            </div>
                            <div className="bg-orange-50 px-3 py-1 rounded-full inline-block text-xs font-bold text-brand-orange">
                                {pendingRequest.distance ? parseFloat(pendingRequest.distance).toFixed(1) : ''} km Away
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="ghost" fullWidth onClick={handleReject} className="bg-gray-100 hover:bg-gray-200 text-gray-600">Reject</Button>
                            <Button variant="primary" fullWidth onClick={handleAccept} className="shadow-lg shadow-brand-orange/30">Accept</Button>
                        </div>
                    </motion.div>
                )}

                {/* PASSENGER POPUP: Status Update Toast */}
                {passengerToast && (
                    <motion.div
                        key="toast"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gray-900 text-white p-4 rounded-2xl shadow-2xl min-w-[300px] pointer-events-auto flex items-center gap-4"
                    >
                        <div className="bg-white p-2 rounded-xl">
                            {passengerToast.icon}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">{passengerToast.title}</h4>
                            <p className="text-xs text-gray-400">{passengerToast.message}</p>
                        </div>
                        <button onClick={() => setPassengerToast(null)} className="text-gray-500 hover:text-white transition">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
