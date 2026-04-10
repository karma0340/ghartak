import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "10K+", label: "Daily Orders" },
    { value: "500+", label: "City Partners" },
    { value: "4.9", label: "App Rating" },
];

export const TrustStats = () => {
    return (
        <section className="py-20 bg-gradient-to-r from-brand-orange to-brand-red text-white relative overflow-hidden">
            {/* Background patterns - Using direct transparency for PDF reliability */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute transform rotate-45 bg-white/10 w-64 h-64 -top-32 -left-32 rounded-3xl" />
                <div className="absolute transform rotate-12 bg-white/10 w-96 h-96 -bottom-48 -right-12 rounded-full" />
            </div>

            <div className="container mx-auto px-4 relative z-20">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 1, y: 0 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05, duration: 0.5 }}
                            className="p-4"
                        >

                            <div className="text-4xl md:text-6xl font-bold font-display mb-2 drop-shadow-md">
                                {stat.value}
                            </div>
                            <div className="text-lg md:text-xl font-medium text-white/90">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
