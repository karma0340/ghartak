import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
    { id: 1, name: "Aarav Sharma", role: "Food Lover", text: "GharTak changed my life! Food delivery is lightning fast.", rating: 5, avatar: "👨‍💻" },
    { id: 2, name: "Priya Singh", role: "Daily Grocery User", text: "Fresh veggies at 7 AM every day. Highly recommended!", rating: 5, avatar: "👩‍🏫" },
    { id: 3, name: "Rohan Gupta", role: "Commuter", text: "The rides are safe and drivers are very polite.", rating: 4, avatar: "👨‍💼" },
    { id: 4, name: "Sneha Patel", role: "Busy Mom", text: "One app for everything. Saves me so much time!", rating: 5, avatar: "👩‍⚕️" },
    { id: 5, name: "Vikram Malhotra", role: "Late Night Coder", text: "Best midnight snack delivery service in town.", rating: 5, avatar: "👨‍💻" },
];

export const Testimonials = () => {
    // Duplicate for infinite scroll
    const marqueeItems = [...testimonials, ...testimonials, ...testimonials];

    return (
        <section className="py-24 bg-brand-light overflow-hidden">
            <div className="container mx-auto px-4 text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-4">What Our Users Say</h2>
                <p className="text-xl text-gray-500">Join thousands of happy customers.</p>
            </div>

            <div className="relative w-full overflow-hidden mask-gradient-x">
                {/* Gradient Masks for fading edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-brand-light to-transparent z-10 pointer-events-none md:block hidden" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-brand-light to-transparent z-10 pointer-events-none md:block hidden" />

                <motion.div
                    className="flex gap-8 w-fit py-8"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 40,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop"
                    }}
                >
                    {marqueeItems.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="w-[350px] flex-shrink-0 bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-brand-orange/10 rounded-full flex items-center justify-center text-3xl">
                                    {item.avatar}
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                                    <p className="text-sm text-gray-500">{item.role}</p>
                                </div>
                            </div>

                            <div className="flex mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-600 italic leading-relaxed text-left">"{item.text}"</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
