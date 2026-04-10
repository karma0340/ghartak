import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Car, Bike, Truck, ChevronRight, CheckCircle2 } from 'lucide-react';

export const DriverRegistration = () => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        vehicleType: 'cab',
        vehicleModel: '',
        vehicleNumber: '',
        licenseNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch((import.meta.env.VITE_API_URL || "") + '/api/drivers/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, ...formData })
            });
            if (res.ok) setSubmitted(true);
        } catch (error) {
            console.error('Error submitting application:', error);
        }
        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-display font-bold mb-4">Application Submitted!</h2>
                    <p className="text-gray-600 mb-8">Your profile is now being reviewed by our admin team. You will be notified once you are approved to start driving.</p>
                    <Button onClick={() => window.location.href = '/'} variant="primary">Back to Home</Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen bg-brand-light">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-display font-bold mb-4">Drive with GharTk</h1>
                    <p className="text-xl text-gray-600">Join our community of professional drivers and start earning today.</p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-soft border border-gray-100 overflow-hidden">
                    <div className="flex border-b border-gray-100">
                        {[1, 2].map((s) => (
                            <div key={s} className={`flex-1 py-4 text-center font-bold text-sm ${step === s ? 'text-brand-orange border-b-2 border-brand-orange' : 'text-gray-400'}`}>
                                STEP {s}: {s === 1 ? 'Vehicle Details' : 'License Info'}
                            </div>
                        ))}
                    </div>

                    <div className="p-8 md:p-12">
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h3 className="text-2xl font-bold mb-8">What do you drive?</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    {[
                                        { id: 'bike', label: 'Bike', icon: Bike },
                                        { id: 'auto', label: 'Auto', icon: Truck },
                                        { id: 'cab', label: 'Sedan', icon: Car },
                                        { id: 'xl', label: 'SUV/XL', icon: Car }
                                    ].map((v) => (
                                        <button key={v.id} onClick={() => setFormData({ ...formData, vehicleType: v.id })}
                                            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${formData.vehicleType === v.id ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-gray-100 hover:border-orange-200 text-gray-400'}`}>
                                            <v.icon className="w-8 h-8" />
                                            <span className="font-bold">{v.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    <input type="text" placeholder="Vehicle Model (e.g. Honda Activa, Swift Dzire)" value={formData.vehicleModel} onChange={e => setFormData({ ...formData, vehicleModel: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-orange outline-none" />
                                    <input type="text" placeholder="Vehicle Number (e.g. PB 65 AB 1234)" value={formData.vehicleNumber} onChange={e => setFormData({ ...formData, vehicleNumber: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-orange outline-none" />
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <Button onClick={() => setStep(2)} disabled={!formData.vehicleModel || !formData.vehicleNumber} size="lg">Next Step <ChevronRight className="ml-2 w-5 h-5" /></Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h3 className="text-2xl font-bold mb-8">Documentation</h3>
                                <div className="space-y-4 mb-8">
                                    <p className="text-sm text-gray-500 mb-4">Please provide your legal driving credentials. We value safety above all else.</p>
                                    <input type="text" placeholder="Driving License Number" value={formData.licenseNumber} onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })} className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-orange outline-none" />
                                </div>
                                <div className="flex justify-between">
                                    <Button onClick={() => setStep(1)} variant="secondary">Back</Button>
                                    <Button onClick={handleSubmit} disabled={!formData.licenseNumber || loading} loading={loading} size="lg">Submit Application</Button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
