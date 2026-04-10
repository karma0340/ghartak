import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CartPage = () => {
    const { cartItems, removeFromCart, cartCount, clearCart, addToCart } = useCart();
    const [message, setMessage] = React.useState('');

    const subtotal = cartItems.reduce((acc, item) => {
        const price = typeof item.price === 'string'
            ? parseInt(item.price.replace('₹', ''))
            : item.price;
        return acc + (price * (item.quantity || 1));
    }, 0);

    const deliveryFee = cartCount > 0 ? 40 : 0;
    const total = subtotal + deliveryFee;

    const handleCheckout = async () => {
        setMessage('');
        const userStr = localStorage.getItem('ghartk_user');
        const userId = userStr ? JSON.parse(userStr).id : 'guest-user';

        if (cartItems.length === 0) return;

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    total,
                    items: cartItems.map(item => ({
                        productId: item.id,
                        quantity: item.quantity || 1
                    }))
                })
            });

            if (res.ok) {
                setMessage('Order placed successfully!');
                clearCart();
            } else {
                setMessage('Failed to place order.');
            }
        } catch (error) {
            setMessage('Network error.');
        }
    };

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen bg-brand-light">
            <div className="container mx-auto max-w-4xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Your Cart</h1>
                    <Link to="/" className="flex items-center text-brand-orange font-bold hover:gap-2 transition-all">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Continue Shopping
                    </Link>
                </div>

                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-soft border border-gray-100 w-full max-w-md mx-auto"
                    >
                        <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-12 h-12 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Let's find something delicious!</p>
                        <Link to="/food">
                            <Button variant="primary">Browse Restaurants</Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-white rounded-[2rem] p-4 md:p-6 shadow-sm border border-gray-100 flex items-center gap-3 md:gap-6 relative"
                                    >
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                                            <p className="text-brand-orange font-bold">{item.price}</p>
                                            <div className="flex items-center gap-4 mt-3">
                                                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="p-1 hover:bg-white rounded-lg transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="p-1 hover:bg-white rounded-lg transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-[2rem] p-8 shadow-soft border border-gray-100 sticky top-32">
                                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-gray-900">₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery Fee</span>
                                        <span className="font-bold text-gray-900">₹{deliveryFee}</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span className="text-brand-orange">₹{total}</span>
                                    </div>
                                </div>
                                {message && <div className="text-center font-bold text-brand-orange mb-4">{message}</div>}
                                <Button onClick={handleCheckout} variant="primary" fullWidth size="lg" className="rounded-2xl py-4 shadow-xl hover:shadow-brand-orange/20">
                                    Checkout Now
                                </Button>
                                <button
                                    onClick={clearCart}
                                    className="w-full text-center text-sm text-gray-400 mt-4 hover:text-red-500 transition-colors"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
