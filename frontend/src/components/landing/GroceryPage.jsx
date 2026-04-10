import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';



const categories = [
    { name: 'All', icon: '🧺' },
    { name: 'Fruits', icon: '🍎' },
    { name: 'Vegetables', icon: '🥦' },
    { name: 'Dairy', icon: '🥛' },
    { name: 'Bakery', icon: '🍞' },
    { name: 'Meat', icon: '🥩' },
];

export const GroceryPage = () => {
    const { addToCart } = useCart();
    const [activeCategory, setActiveCategory] = React.useState('All');
    const [itemWithCat, setItemWithCat] = React.useState([]);

    React.useEffect(() => {
        fetch('/api/products?category=GROCERY')
            .then(res => res.json())
            .then(data => {
                const mapped = data.map(item => {
                    let type = 'Other';
                    if (item.name.includes('Apple') || item.name.includes('Watermelon')) type = 'Fruits';
                    else if (item.name.includes('Broccoli')) type = 'Vegetables';
                    else if (item.name.includes('Milk') || item.name.includes('Eggs') || item.name.includes('Cheese')) type = 'Dairy';
                    else if (item.name.includes('Bread')) type = 'Bakery';
                    else if (item.name.includes('Chicken')) type = 'Meat';
                    return { ...item, type };
                });
                setItemWithCat(mapped);
            })
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
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 text-gray-900">Fresh Groceries</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Daily essentials delivered in minutes. Quality checked and fresh from the farm.</p>
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

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {itemWithCat
                        .filter(item => activeCategory === 'All' || item.type === activeCategory)
                        .map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ y: -8 }}
                                className="bg-white rounded-[2.5rem] p-4 md:p-5 shadow-soft hover:shadow-2xl transition-all border border-gray-100 group text-center"
                            >
                                <div className="h-44 md:h-52 overflow-hidden rounded-[2rem] mb-4 relative bg-gray-50">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60";
                                        }}
                                    />
                                </div>
                                <div className="px-2 pb-2">
                                    <h3 className="text-xl font-bold mb-1 truncate text-gray-900 group-hover:text-brand-orange transition-colors">{item.name}</h3>
                                    <p className="text-gray-500 text-sm mb-3">{item.description}</p>
                                    <p className="text-brand-orange font-bold text-2xl mb-4">₹{item.price}</p>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        fullWidth
                                        className="rounded-2xl font-bold py-3 shadow-md hover:shadow-emerald-500/10"
                                        onClick={() => addToCart({ ...item, price: `₹${item.price}` })}
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

