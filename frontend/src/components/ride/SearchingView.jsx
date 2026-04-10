import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Clock, DollarSign, X, AlertTriangle, 
    ShieldCheck, Smartphone, Navigation2,
    ChevronDown, Info
} from 'lucide-react';
import { Button } from '../ui/Button';

export const SearchingView = ({ ride, onBoost, onCancel }) => {
    const [timeLeft, setTimeLeft] = useState(90); // 1:30
    const [showCancelOptions, setShowCancelOptions] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const r = s % 60;
        return `${m}:${r < 10 ? '0' : ''}${r}`;
    };

    const cancelReasons = [
        "Waiting too long",
        "Found another ride",
        "Entered wrong destination",
        "Captain too far",
        "Changed my mind"
    ];

    return (
        <div className="flex flex-col h-full bg-white rounded-t-[2.5rem] shadow-2xl overflow-hidden">
            {/* Header / Timer */}
            <div className="bg-gradient-to-r from-brand-orange to-brand-red p-8 text-white relative">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold mb-1">Finding your Captain</h2>
                        <p className="opacity-80 flex items-center gap-2 font-medium">
                           <Clock className="w-4 h-4" /> Estimated wait: {formatTime(timeLeft)}
                        </p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                        <Navigation2 className="w-6 h-6 animate-pulse" />
                    </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: `${(1 - timeLeft/90) * 100}%` }}
                        className="h-full bg-white shadow-[0_0_10px_#fff]"
                    />
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {/* Active Ride Card */}
                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 flex items-center justify-between">
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Ride</h4>
                        <p className="text-lg font-bold text-gray-900 line-clamp-1">
                            {ride.rideType.toUpperCase()} • {parseFloat(ride.distance || 0).toFixed(1)}km
                        </p>
                    </div>
                    <div className="text-2xl font-black text-brand-orange">₹{ride.price}</div>
                </div>

                {/* Boost Section */}
                <div className="bg-orange-50 border border-brand-orange border-opacity-20 p-6 rounded-[2rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <DollarSign className="w-12 h-12" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-brand-orange" /> Find captains faster?
                    </h4>
                    <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                        Incentivize nearby captains to accept your ride immediately by increasing the fare.
                    </p>

                    <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-2">
                            {[5, 10, 20, 30].map(amt => (
                                <button 
                                    key={amt}
                                    onClick={() => onBoost(amt)}
                                    className="py-3 rounded-xl bg-white border border-brand-orange/20 text-brand-orange font-bold text-sm hover:bg-brand-orange hover:text-white transition-all shadow-sm"
                                >
                                    +₹{amt}
                                </button>
                            ))}
                        </div>
                        
                        <div className="relative group">
                            <input 
                                type="number" 
                                placeholder="Enter custom boost amount..." 
                                className="w-full pl-4 pr-24 py-3.5 rounded-xl border-2 border-dashed border-brand-orange/30 bg-white/50 focus:bg-white focus:border-brand-orange outline-none text-sm font-bold transition-all"
                                id="custom-boost-input"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const val = parseInt(e.target.value);
                                        if (val > 0) {
                                            onBoost(val);
                                            e.target.value = '';
                                        }
                                    }
                                }}
                            />
                            <button 
                                onClick={() => {
                                    const input = document.getElementById('custom-boost-input');
                                    const val = parseInt(input.value);
                                    if (val > 0) {
                                        onBoost(val);
                                        input.value = '';
                                    }
                                }}
                                className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-brand-orange text-white text-[10px] font-black uppercase tracking-tighter hover:bg-brand-red transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest px-2">
                        <ShieldCheck className="w-4 h-4" /> Your safety is our priority
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm font-medium text-gray-500">
                        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-2xl">
                           <Smartphone className="w-4 h-4" /> 24x7 support
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-2xl">
                           <Info className="w-4 h-4" /> Verified Captains
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Cancel */}
            <div className="p-6 bg-white border-t border-gray-100">
                <Button 
                    variant="ghost" 
                    fullWidth 
                    onClick={() => setShowCancelOptions(true)}
                    className="text-gray-400 font-bold hover:text-brand-red"
                >
                    Cancel Ride
                </Button>
            </div>

            {/* Cancel Modal Overlay */}
            <AnimatePresence>
                {showCancelOptions && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end"
                    >
                        <motion.div 
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            className="w-full bg-white rounded-t-[2.5rem] p-8"
                        >
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
                            <h3 className="text-2xl font-black text-gray-900 mb-6">Why do you want to cancel?</h3>
                            <div className="space-y-3 mb-8">
                                {cancelReasons.map(reason => (
                                    <button 
                                        key={reason}
                                        onClick={() => onCancel(reason)}
                                        className="w-full text-left p-4 rounded-2xl bg-gray-50 hover:bg-brand-orange hover:text-white font-bold transition-all text-gray-700"
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>
                            <Button variant="secondary" fullWidth onClick={() => setShowCancelOptions(false)}>
                                Keep Searching
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
