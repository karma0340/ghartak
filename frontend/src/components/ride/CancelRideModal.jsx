import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

const REASONS = [
    { id: 'too_long', label: 'Captain is taking too long', sub: 'Arrival time keep increasing' },
    { id: 'wrong_loc', label: 'Wrong pickup location', sub: 'Need to change the starting point' },
    { id: 'changed_mind', label: 'Changed my mind', sub: 'I don\'t need a ride anymore' },
    { id: 'asked_cancel', label: 'Captain asked me to cancel', sub: 'Captain is unable to reach' },
    { id: 'another_way', label: 'Found another way', sub: 'Found a different transport' }
];

export const CancelRideModal = ({ isOpen, onClose, onConfirm, loading }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div 
                        initial={{ y: "100%", opacity: 0.5 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0.5 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl">Cancel Ride?</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Please select a reason</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        {/* Reasons List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                            {REASONS.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => onConfirm(r.label)}
                                    disabled={loading}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-all border border-transparent hover:border-gray-100 disabled:opacity-50 group"
                                >
                                    <div className="text-left">
                                        <p className="font-bold text-gray-800 group-hover:text-brand-red transition-colors">{r.label}</p>
                                        <p className="text-xs text-gray-400 font-medium">{r.sub}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-red transition-all group-hover:translate-x-1" />
                                </button>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-gray-50 flex items-center gap-4">
                            <Button variant="outline" fullWidth onClick={onClose} disabled={loading} className="bg-white">
                                Keep Booking
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
