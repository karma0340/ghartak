import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, PackageCheck, Truck } from 'lucide-react';

const steps = [
    {
        id: 1,
        icon: MousePointer2,
        title: "Choose Service",
        desc: "Select from Food, Groceries, or Rides in one tap.",
        color: "bg-blue-100 text-blue-600",
    },
    {
        id: 2,
        icon: PackageCheck,
        title: "Place Order",
        desc: "Confirm your details and pay securely.",
        color: "bg-purple-100 text-purple-600",
    },
    {
        id: 3,
        icon: Truck,
        title: "Fast Delivery",
        desc: "Track your order in real-time until it arrives.",
        color: "bg-orange-100 text-orange-600",
    },
];

export const HowItWorks = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-4">How It Works</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Getting what you need is as easy as 1, 2, 3.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            <div className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300 ring-8 ring-white`}>
                                <step.icon className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                            <p className="text-gray-600 leading-relaxed max-w-xs">{step.desc}</p>

                            {/* Step Number Badge */}
                            <div className="absolute -top-4 -right-4 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-xl">
                                {step.id}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
