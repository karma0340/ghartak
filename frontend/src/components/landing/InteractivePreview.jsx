import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Truck, Utensils, Star, Clock, MapPin } from 'lucide-react';

const tabs = [
    { id: 'food', label: 'Food Order', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-100', path: '/food' },
    { id: 'grocery', label: 'Grocery', icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-100', path: '/grocery' },
    { id: 'ride', label: 'Book Ride', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-100', path: '/ride' },
];

const content = {
    food: {
        title: "Satisfy Your Cravings",
        subtitle: "Pizza, Sushi, Burger? We have it all.",
        items: [
            { name: "Spicy Pepperoni", price: "₹299", rating: "4.8", time: "25 min", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=60" },
            { name: "Veggie Supreme", price: "₹249", rating: "4.5", time: "30 min", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&auto=format&fit=crop&q=60" },
        ],
        accent: "bg-orange-500",
        mainImg: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60"
    },
    grocery: {
        title: "Fresh Farm to Table",
        subtitle: "Vegetables, Fruits, and Daily Staples.",
        items: [
            { name: "Organic Bananas", price: "₹60/kg", rating: "4.9", time: "10 min", img: "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=200&auto=format&fit=crop&q=60" },
            { name: "Fresh Milk", price: "₹45/L", rating: "4.7", time: "15 min", img: "https://images.unsplash.com/photo-1550583724-125581f77833?w=200&auto=format&fit=crop&q=60" },
        ],
        accent: "bg-green-500",
        mainImg: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60"
    },
    ride: {
        title: "Travel with Comfort",
        subtitle: "Choose from Bike, Auto, or Prime Sedan.",
        items: [
            { name: "Prime Sedan", price: "₹450", rating: "4.8", time: "3 min", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&auto=format&fit=crop&q=60" },
            { name: "City Bike", price: "₹85", rating: "4.6", time: "1 min", img: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?w=200&auto=format&fit=crop&q=60" },
        ],
        accent: "bg-blue-500",
        mainImg: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&auto=format&fit=crop&q=60"
    },
};

export const InteractivePreview = () => {
    const [activeTab, setActiveTab] = useState('food');
    const navigate = useNavigate();

    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-4">See It In Action</h2>
                    <p className="text-xl text-gray-500">Experience the seamless flow of our super app.</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-16 flex-wrap">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-white shadow-xl scale-110 text-gray-900 ring-2 ring-gray-100'
                                : 'bg-transparent text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            <span className={`p-2 rounded-full ${activeTab === tab.id ? tab.color + ' ' + tab.bg : 'text-gray-400'}`}>
                                <tab.icon className="w-6 h-6" />
                            </span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Preview Area */}
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 1, scale: 1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 flex flex-col lg:flex-row gap-12 items-center"
                        >
                            {/* Text Side */}
                            <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left">
                                <motion.div
                                    initial={{ opacity: 1, y: 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-white text-[10px] md:text-sm font-bold uppercase tracking-widest ${content[activeTab].accent}`}
                                >

                                    Featured Service
                                </motion.div>
                                <h3 className="text-3xl md:text-6xl font-bold font-display text-gray-900 leading-tight">
                                    {content[activeTab].title}
                                </h3>
                                <p className="text-lg md:text-xl text-gray-500 leading-relaxed">
                                    {content[activeTab].subtitle} Enjoy lightning fast deliveries and premium quality service right at your doorstep.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                                    <button
                                        onClick={() => navigate(tabs.find(t => t.id === activeTab).path)}
                                        className={`px-8 py-4 md:px-10 md:py-5 rounded-2xl text-white text-base md:text-lg font-bold shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer ${content[activeTab].accent}`}
                                    >
                                        Explore {tabs.find(t => t.id === activeTab).label} Now
                                    </button>
                                </div>
                            </div>

                            {/* Mock Screen Side */}
                            <div className="flex-1 w-full relative max-w-[340px] lg:max-w-none mx-auto">
                                <div className="bg-gray-100 rounded-[2.5rem] p-2 relative overflow-hidden shadow-inner border-[6px] md:border-[8px] border-gray-900 aspect-[9/11] sm:aspect-auto">
                                    <div className="bg-white rounded-[2rem] h-full overflow-hidden flex flex-col">
                                        {/* App Header */}
                                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                            <div className="font-bold text-gray-900">GharTak App</div>
                                            <div className="w-8 h-8 rounded-full bg-gray-100" />
                                        </div>

                                        {/* App Banner */}
                                        <div className="h-40 w-full overflow-hidden">
                                            <img src={content[activeTab].mainImg} alt="Banner" className="w-full h-full object-cover" />
                                        </div>

                                        {/* App List */}
                                        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                                            <div className="font-bold text-lg text-gray-800">Available Near You</div>
                                            {content[activeTab].items.map((item, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-transparent hover:border-brand-orange/20 transition-all"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <img src={item.img} alt={item.name} className="w-14 h-14 rounded-xl object-cover shadow-sm" />
                                                        <div>
                                                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                                                            <div className="flex items-center text-xs text-gray-500 gap-3 mt-1">
                                                                <span className="flex items-center"><Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />{item.rating}</span>
                                                                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{item.time}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="font-bold text-gray-900">{item.price}</div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Decor */}
                                <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full ${content[activeTab].accent} opacity-20 blur-3xl animate-pulse`} />
                                <div className={`absolute -top-6 -left-6 w-32 h-32 rounded-full ${content[activeTab].accent} opacity-10 blur-3xl animate-pulse delay-1000`} />
                            </div>

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
