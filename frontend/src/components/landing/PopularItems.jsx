import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const items = [
    {
        id: "trend-1",
        name: "Spicy Ramen Bowl",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60",
        price: "₹249",
        rating: 4.8,
        category: "Food",
        path: "/food"
    },
    {
        id: "trend-2",
        name: "Fresh Avocados (2pc)",
        image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop&q=60",
        price: "₹180",
        rating: 4.9,
        category: "Grocery",
        path: "/grocery"
    },
    {
        id: "trend-3",
        name: "Classic Cheeseburger",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
        price: "₹199",
        rating: 4.5,
        category: "Food",
        path: "/food"
    },
    {
        id: "trend-4",
        name: "Organic Orange Juice",
        image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&auto=format&fit=crop&q=60",
        price: "₹120",
        rating: 4.7,
        category: "Grocery",
        path: "/grocery"
    },
    {
        id: "trend-5",
        name: "Sushi Platter",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60",
        price: "₹599",
        rating: 4.9,
        category: "Food",
        path: "/food"
    },
    {
        id: "trend-6",
        name: "Whole Wheat Bread",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60",
        price: "₹45",
        rating: 4.6,
        category: "Grocery",
        path: "/grocery"
    },
];

export const PopularItems = () => {
    const scrollRef = useRef(null);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    return (
        <section className="py-24 bg-brand-light relative">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 mb-2">Trending Now</h2>
                        <p className="text-xl text-gray-500">Most ordered items this week</p>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <button
                            onClick={() => scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })}
                            className="p-3 rounded-2xl bg-white border border-gray-200 hover:border-brand-orange text-gray-600 hover:text-brand-orange transition-all shadow-sm"
                        >
                            ←
                        </button>
                        <button
                            onClick={() => scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })}
                            className="p-3 rounded-2xl bg-white border border-gray-200 hover:border-brand-orange text-gray-600 hover:text-brand-orange transition-all shadow-sm"
                        >
                            →
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 md:gap-8 pb-12 snap-x no-scrollbar -mx-4 px-4"
                >
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -10 }}
                            className="min-w-[300px] bg-white rounded-[2.5rem] shadow-soft hover:shadow-2xl transition-all duration-300 p-6 snap-center border border-gray-100 group relative overflow-hidden cursor-pointer"
                        >
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 flex items-center shadow-sm z-10 border border-black/5">
                                <Star className="w-3.5 h-3.5 text-yellow-400 mr-1 fill-yellow-400" /> {item.rating}
                            </div>

                            <div
                                onClick={() => navigate(item.path)}
                                className="h-48 overflow-hidden rounded-[2rem] mb-6 bg-gray-50 group-hover:bg-brand-orange/5 transition-colors relative"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60";
                                    }}
                                />
                            </div>

                            <div className="mb-2 px-2">
                                <span className="text-[10px] uppercase font-bold text-brand-orange tracking-widest bg-brand-orange/10 px-2 py-0.5 rounded-md">{item.category}</span>
                            </div>

                            <h3
                                onClick={() => navigate(item.path)}
                                className="font-bold text-xl text-gray-900 mb-2 px-2 line-clamp-1 group-hover:text-brand-orange transition-colors"
                            >
                                {item.name}
                            </h3>

                            <div className="flex justify-between items-center mt-6 px-2">
                                <span className="text-2xl font-bold text-gray-900">{item.price}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(item);
                                    }}
                                    className="bg-gray-900 text-white p-4 rounded-2xl hover:bg-brand-orange transition-all shadow-lg hover:shadow-brand-orange/30 active:scale-90"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
