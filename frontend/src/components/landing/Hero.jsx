import { motion } from 'framer-motion';
import { ShoppingBag, Truck, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

// High-quality, reliable Unsplash images (Cars, Food, Groceries)
const BACKGROUND_IMAGES = [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1600', // Ride/Car
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1600', // Food
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600', // Grocery
    'https://images.unsplash.com/photo-1441148345475-03a2e82f9719?auto=format&fit=crop&q=80&w=1600', // Ride 2
    'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&q=80&w=1600', // Food 2
    'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&q=80&w=1600', // Grocery 2
];

export const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-[95vh] w-full flex items-center justify-center text-white overflow-hidden pt-20 pb-20 px-4">
            {/* Infinite Scrolling Background Slider */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    className="flex h-full w-max"
                    animate={{
                        x: [0, "-50%"],
                    }}
                    transition={{
                        duration: 80, // Slower, more elegant movement
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {[...BACKGROUND_IMAGES, ...BACKGROUND_IMAGES].map((src, idx) => (
                        <div
                            key={idx}
                            className="h-full w-screen flex-shrink-0 relative"
                        >
                            <img
                                src={src}
                                alt="Background"
                                className="w-full h-full object-cover"
                                loading="eager"
                            />
                            {/* Darken individual images slightly for better text contrast */}
                            <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Subtle Gradient Overlay - Reduced brightness */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/70 z-1"></div>
            <div className="absolute inset-0 bg-black/40 z-2"></div>

            {/* Dynamic Background Elements - Tone down pulse */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-3">
                <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-brand-orange/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-brand-pink/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto max-w-7xl relative z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8"
                >
                    <span className="inline-block py-2 px-6 rounded-full bg-brand-red text-white text-xs font-bold tracking-widest mb-8 uppercase shadow-glow">
                        🚀 India's Most Trusted Super App
                    </span>
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-extrabold font-display leading-[1.1] mb-6 tracking-tight [text-shadow:_0_4px_24px_rgba(0,0,0,0.5)]">
                        Hungry? Groceries? <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-brand-yellow to-white">
                            Going Somewhere?
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-white max-w-2xl mx-auto leading-relaxed mb-10 [text-shadow:_0_2px_10px_rgba(0,0,0,0.5)]">
                        Everything you need, delivered in minutes. One app for food, groceries, and rides.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-row gap-3 md:gap-6 w-full justify-center px-4 flex-wrap"
                >

                    <Button
                        size="lg"
                        className="bg-brand-red text-white text-base md:text-xl font-bold hover:bg-red-600 shadow-xl px-4 md:px-10 py-6 md:py-8 rounded-2xl transform transition hover:scale-105 active:scale-95 group flex-1 max-w-[280px]"
                        onClick={() => navigate('/food')}
                    >
                        <Utensils className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 group-hover:rotate-12 transition-transform" /> Order Food
                    </Button>
                    <Button
                        size="lg"
                        className="bg-emerald-600 text-white text-base md:text-xl font-bold hover:bg-emerald-700 shadow-xl px-4 md:px-10 py-6 md:py-8 rounded-2xl transform transition hover:scale-105 active:scale-95 group flex-1 max-w-[280px]"
                        onClick={() => navigate('/grocery')}
                    >
                        <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 group-hover:rotate-12 transition-transform" /> Shop Groceries
                    </Button>
                    <Button
                        size="lg"
                        className="bg-blue-600 text-white text-base md:text-xl font-bold hover:bg-blue-700 shadow-xl px-4 md:px-10 py-6 md:py-8 rounded-2xl transform transition hover:scale-105 active:scale-95 group flex-1 max-w-[280px]"
                        onClick={() => navigate('/ride')}
                    >
                        <Truck className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 group-hover:rotate-12 transition-transform" /> Book a Ride
                    </Button>
                </motion.div>


            </div>
        </section>
    );
};


