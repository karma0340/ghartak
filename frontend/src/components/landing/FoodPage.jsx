import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';



const categories = [
    { name: 'All', icon: '🍽️' },
    { name: 'Pizza', icon: '🍕' },
    { name: 'Burgers', icon: '🍔' },
    { name: 'Sushi', icon: '🍣' },
    { name: 'Healthy', icon: '🥗' },
    { name: 'Pasta', icon: '🍝' },
    { name: 'Desserts', icon: '🍦' },
];

export const FoodPage = () => {
    const { addToCart } = useCart();
    const [activeCategory, setActiveCategory] = React.useState('All');
    const [restaurants, setRestaurants] = React.useState([]);

    React.useEffect(() => {
        fetch((import.meta.env.VITE_API_URL || "") + '/api/products?category=FOOD')
            .then(res => res.json())
            .then(data => setRestaurants(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen bg-brand-light">
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 text-gray-900">Delicious Food, Delivered</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Explore the best restaurants in town and get your favorite meals delivered in a flash.</p>
                </motion.div>

                {/* Categories Bar */}
                <div className="flex overflow-x-auto gap-4 mb-12 pb-4 no-scrollbar justify-start md:justify-center">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all shadow-sm ${activeCategory === cat.name
                                    ? 'bg-brand-orange text-white shadow-brand-orange/20 scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                                }`}
                        >
                            <span>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {restaurants
                        .filter(res => activeCategory === 'All' || res.description?.includes(activeCategory))
                        .map((res) => (
                            <motion.div
                                key={res.id}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-[2.5rem] p-5 shadow-soft hover:shadow-2xl transition-all border border-gray-100 group"
                            >
                                <div className="h-56 overflow-hidden rounded-[2rem] mb-6 relative">
                                    <img
                                        src={res.image}
                                        alt={res.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60";
                                        }}
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold text-gray-800 shadow-sm border border-black/5">
                                        ★ 4.8
                                    </div>
                                </div>
                                <div className="px-2 pb-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-brand-orange transition-colors">{res.name}</h3>
                                        <span className="text-xl font-bold text-brand-orange">₹{res.price}</span>
                                    </div>
                                    <p className="text-gray-500 mb-6">{res.description} • {res.time}</p>
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        className="rounded-2xl py-4 shadow-xl hover:shadow-brand-orange/20"
                                        onClick={() => addToCart({ ...res, image: res.image })}
                                    >
                                        Add to Cart
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                </div>
            </div>
        </div>
    );
};

