# GharTk Project - Full Source Code & Visuals

## Visual Assets Gallery

![Image 1](https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600)

![Image 2](https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600)

![Image 3](https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600)

![Image 4](https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60)

---

## Project Structure

### File: src\App.css

```css
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}

```

### File: src\App.jsx

```jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/landing/Hero';
import { Services } from './components/landing/Services';
import { HowItWorks } from './components/landing/HowItWorks';
import { InteractivePreview } from './components/landing/InteractivePreview';
import { TrustStats } from './components/landing/TrustStats';
import { PopularItems } from './components/landing/PopularItems';
import { Testimonials } from './components/landing/Testimonials';
import { FinalCTA } from './components/landing/FinalCTA';
import { FoodPage } from './components/landing/FoodPage';
import { GroceryPage } from './components/landing/GroceryPage';
import { RidePage } from './components/landing/RidePage';
import { LoginPage } from './components/landing/LoginPage';
import { CartPage } from './components/landing/CartPage';
import { CartProvider } from './context/CartContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const HomePage = () => (
  <>
    <div id="home">
      <Hero />
    </div>
    <div id="services">
      <Services />
    </div>
    <HowItWorks />
    <div id="preview" className="relative z-10">
      <InteractivePreview />
    </div>
    <TrustStats />
    <div className="relative z-10">
      <PopularItems />
    </div>
    <Testimonials />
    <FinalCTA />
  </>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-brand-light font-sans text-gray-900 overflow-x-hidden w-full selection:bg-brand-orange selection:text-white">
          <Header />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/food" element={<FoodPage />} />
              <Route path="/grocery" element={<GroceryPage />} />
              <Route path="/ride" element={<RidePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

```

### File: src\components\landing\CartPage.jsx

```jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CartPage = () => {
    const { cartItems, removeFromCart, cartCount, clearCart, addToCart } = useCart();

    const subtotal = cartItems.reduce((acc, item) => {
        const price = typeof item.price === 'string'
            ? parseInt(item.price.replace('₹', ''))
            : item.price;
        return acc + (price * (item.quantity || 1));
    }, 0);

    const deliveryFee = cartCount > 0 ? 40 : 0;
    const total = subtotal + deliveryFee;

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen bg-brand-light">
            <div className="container mx-auto max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-display font-bold text-gray-900">Your Cart</h1>
                    <Link to="/" className="flex items-center text-brand-orange font-bold hover:gap-2 transition-all">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Continue Shopping
                    </Link>
                </div>

                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] p-12 text-center shadow-soft border border-gray-100"
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
                                        className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 flex items-center gap-4 md:gap-6"
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
                                <Button variant="primary" fullWidth size="lg" className="rounded-2xl py-4 shadow-xl hover:shadow-brand-orange/20">
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

```

### File: src\components\landing\FinalCTA.jsx

```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Download, Smartphone } from 'lucide-react';

export const FinalCTA = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 relative overflow-hidden bg-brand-light">
            <div className="container mx-auto px-4 relative z-10">
                <div className="bg-gradient-to-br from-brand-orange via-brand-red to-brand-pink rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">

                    {/* Decorative Circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-yellow opacity-20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto space-y-8 relative z-10"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold font-display leading-tight drop-shadow-lg">
                            One App. Endless Possibilities.
                        </h2>
                        <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto">
                            Join millions who trust GharTak for their daily needs. Download now and get 50% off your first order!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                            <Button
                                size="lg"
                                className="bg-white text-brand-red hover:bg-gray-50 text-lg font-bold px-10 py-5 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                                onClick={() => navigate('/login')}
                            >
                                <Download className="mr-2 w-6 h-6" /> Download App
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:border-white text-lg font-semibold px-10 py-5 rounded-full"
                                onClick={() => navigate('/login')}
                            >
                                <Smartphone className="mr-2 w-6 h-6" /> View Demo
                            </Button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

```

### File: src\components\landing\FoodPage.jsx

```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';

const restaurants = [
    { id: "food-1", name: "Pizza Palace", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60", type: "Italian • Pizza", price: "₹299" },
    { id: "food-2", name: "Burger King", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&auto=format&fit=crop&q=60", type: "Fast Food • Burgers", price: "₹199" },
    { id: "food-3", name: "Sushi House", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&auto=format&fit=crop&q=60", type: "Japanese • Sushi", price: "₹599" },
    { id: "food-4", name: "Green Garden", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60", type: "Healthy • Salads", price: "₹249" },
    { id: "food-5", name: "Pasta Paradise", image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=500&auto=format&fit=crop&q=60", type: "Italian • Pasta", price: "₹349" },
    { id: "food-6", name: "Sweet Treats", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&auto=format&fit=crop&q=60", type: "Desserts • Ice Cream", price: "₹149" },
];

export const FoodPage = () => {
    const { addToCart } = useCart();

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen bg-brand-light">
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 text-gray-900">Delicious Food, Delivered</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Explore the best restaurants in town and get your favorite meals delivered in a flash.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {restaurants.map((res) => (
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
                                    <span className="text-xl font-bold text-brand-orange">{res.price}</span>
                                </div>
                                <p className="text-gray-500 mb-6">{res.type} • 25-30 min</p>
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

```

### File: src\components\landing\GroceryPage.jsx

```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';

const items = [
    { id: "groc-1", name: "Red Apples", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?w=500&auto=format&fit=crop&q=60", weight: "1kg", price: 120 },
    { id: "groc-2", name: "Broccoli", image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=500&auto=format&fit=crop&q=60", weight: "500g", price: 45 },
    { id: "groc-3", name: "Fresh Milk", image: "https://images.unsplash.com/photo-1550583724-125581f77833?w=500&auto=format&fit=crop&q=60", weight: "1L", price: 60 },
    { id: "groc-4", name: "Whole Wheat Bread", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60", weight: "400g", price: 45 },
    { id: "groc-5", name: "Organic Eggs", image: "https://images.unsplash.com/photo-1518562180175-34a163b1a9a5?w=500&auto=format&fit=crop&q=60", weight: "6pcs", price: 70 },
    { id: "groc-6", name: "Fresh Cheese", image: "https://images.unsplash.com/photo-1485962391905-1a76d37961b7?w=500&auto=format&fit=crop&q=60", weight: "200g", price: 150 },
    { id: "groc-7", name: "Chicken Breast", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60", weight: "500g", price: 250 },
    { id: "groc-8", name: "Sweet Watermelon", image: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=500&auto=format&fit=crop&q=60", weight: "2kg", price: 180 },
];

export const GroceryPage = () => {
    const { addToCart } = useCart();

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen bg-brand-light">
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 text-gray-900">Fresh Groceries</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Daily essentials delivered in minutes. Quality checked and fresh from the farm.</p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {items.map((item) => (
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
                                <p className="text-gray-500 text-sm mb-3">{item.weight}</p>
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

```

### File: src\components\landing\Hero.jsx

```jsx
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
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8"
                >
                    <span className="inline-block py-2 px-6 rounded-full bg-brand-red text-white text-xs font-bold tracking-widest mb-8 uppercase shadow-glow">
                        🚀 India's Most Trusted Super App
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold font-display leading-[1.1] mb-6 tracking-tight [text-shadow:_0_4px_24px_rgba(0,0,0,0.5)]">
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full justify-center"
                >
                    <Button
                        size="lg"
                        className="bg-brand-red text-white text-lg font-bold hover:bg-brand-orange shadow-xl px-10 py-7 rounded-2xl transform transition hover:scale-105 active:scale-95"
                        onClick={() => navigate('/food')}
                    >
                        <Utensils className="w-6 h-6 mr-2" /> Order Food
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-brand-red text-lg font-semibold px-10 py-7 rounded-2xl backdrop-blur-md transform transition hover:scale-105 active:scale-95"
                        onClick={() => navigate('/grocery')}
                    >
                        <ShoppingBag className="w-6 h-6 mr-2" /> Shop Groceries
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-brand-red text-lg font-semibold px-10 py-7 rounded-2xl backdrop-blur-md transform transition hover:scale-105 active:scale-95"
                        onClick={() => navigate('/ride')}
                    >
                        <Truck className="w-6 h-6 mr-2" /> Book a Ride
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};



```

### File: src\components\landing\HowItWorks.jsx

```jsx
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

```

### File: src\components\landing\InteractivePreview.jsx

```jsx
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
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 flex flex-col lg:flex-row gap-12 items-center"
                        >
                            {/* Text Side */}
                            <div className="flex-1 space-y-8 text-center lg:text-left">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`inline-block px-6 py-2 rounded-full text-white text-sm font-bold uppercase tracking-widest ${content[activeTab].accent}`}
                                >
                                    Featured Service
                                </motion.div>
                                <h3 className="text-4xl md:text-6xl font-bold font-display text-gray-900 leading-tight">
                                    {content[activeTab].title}
                                </h3>
                                <p className="text-xl text-gray-500 leading-relaxed">
                                    {content[activeTab].subtitle} Enjoy lightning fast deliveries and premium quality service right at your doorstep.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                                    <button
                                        onClick={() => navigate(tabs.find(t => t.id === activeTab).path)}
                                        className={`px-10 py-5 rounded-2xl text-white text-lg font-bold shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer ${content[activeTab].accent}`}
                                    >
                                        Explore {tabs.find(t => t.id === activeTab).label} Now
                                    </button>
                                </div>
                            </div>

                            {/* Mock Screen Side */}
                            <div className="flex-1 w-full relative">
                                <div className="bg-gray-100 rounded-[2.5rem] p-2 relative overflow-hidden shadow-inner border-[8px] border-gray-900 aspect-[9/10] sm:aspect-auto">
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

```

### File: src\components\landing\LoginPage.jsx

```jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen bg-brand-light flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-soft border border-gray-100 w-full max-w-md"
            >
                <h2 className="text-4xl font-display font-bold text-center mb-8">
                    {isLogin ? 'Welcome Back!' : 'Create Account'}
                </h2>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    {!isLogin && (
                        <input type="text" placeholder="Full Name" className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-orange outline-none" />
                    )}
                    <input type="email" placeholder="Email Address" className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-orange outline-none" />
                    <input type="password" placeholder="Password" className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-orange outline-none" />

                    <Button variant="primary" size="lg" fullWidth>{isLogin ? 'Login' : 'Sign Up'}</Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-brand-orange font-bold hover:underline"
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

```

### File: src\components\landing\PopularItems.jsx

```jsx
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
                    className="flex overflow-x-auto gap-8 pb-12 snap-x scrollbar-hide -mx-4 px-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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

```

### File: src\components\landing\RidePage.jsx

```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export const RidePage = () => {
    return (
        <div className="pt-32 pb-20 px-4 min-h-screen">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-display font-bold mb-4">Book a Ride</h1>
                    <p className="text-xl text-gray-600">Safe and reliable travel anywhere.</p>
                </motion.div>

                <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 shadow-soft border border-gray-100">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Pickup location" className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-orange outline-none" />
                            <input type="text" placeholder="Destination" className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-orange outline-none" />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {['🛵 Bike', '🛺 Auto', '🚗 Cab'].map((type) => (
                                <button key={type} className="p-4 rounded-2xl border-2 border-gray-100 hover:border-brand-orange hover:bg-brand-orange/5 transition-all text-lg font-bold">
                                    {type}
                                </button>
                            ))}
                        </div>

                        <Button variant="primary" size="lg" fullWidth>Check Pricing</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

```

### File: src\components\landing\Services.jsx

```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Truck, Utensils } from 'lucide-react';

const services = [
    {
        id: 1,
        icon: Utensils,
        title: "Food Delivery",
        desc: "Cravings? Get hot meals from top restaurants delivered in a flash.",
        color: "from-orange-400 to-red-500",
        bg: "bg-orange-50",
        text: "text-orange-600",
        path: "/food"
    },
    {
        id: 2,
        icon: ShoppingBag,
        title: "Grocery Shopping",
        desc: "Fresh veggies, dairy, and daily essentials at your door in minutes.",
        color: "from-emerald-400 to-green-600",
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        path: "/grocery"
    },
    {
        id: 3,
        icon: Truck,
        title: "Ride Booking",
        desc: "Going somewhere? Book safe and affordable rides instantly.",
        color: "from-blue-400 to-indigo-600",
        bg: "bg-blue-50",
        text: "text-blue-600",
        path: "/ride"
    }
];

export const Services = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 px-4 bg-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-brand-orange font-bold tracking-wider uppercase text-sm"
                    >
                        What We Do
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold font-display text-gray-900 mt-2 mb-6"
                    >
                        Your Daily Super App
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
                    >
                        From your morning coffee to your evening commute, we've got you covered with one simple app.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            whileHover={{ y: -10 }}
                            onClick={() => navigate(service.path)}
                            className={`relative overflow-hidden group rounded-[2rem] p-8 ${service.bg} border border-transparent hover:border-gray-100 transition-all duration-300 shadow-sm hover:shadow-2xl cursor-pointer`}
                        >
                            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-8 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                <service.icon className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">{service.desc}</p>

                            {/* Decorative Blob */}
                            <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${service.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300`} />

                            <div className="mt-8 flex items-center text-gray-900 font-bold group-hover:translate-x-2 transition-transform">
                                Explore <span className="ml-2">→</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

```

### File: src\components\landing\Testimonials.jsx

```jsx
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

```

### File: src\components\landing\TrustStats.jsx

```jsx
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
            {/* Background patterns */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute transform rotate-45 bg-white w-64 h-64 -top-32 -left-32 rounded-3xl" />
                <div className="absolute transform rotate-12 bg-white w-96 h-96 -bottom-48 -right-12 rounded-full" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
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

```

### File: src\components\layout\Footer.jsx

```jsx
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const links = {
    Company: ["About Us", "Careers", "Blog", "Partner with us"],
    Services: ["Order Food", "Book a Ride", "Grocery Delivery", "Business"],
    Legal: ["Terms & Conditions", "Privacy Policy", "Cookie Policy"],
    Support: ["Help Center", "Safety Center", "Contact Us"],
};

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-24 pb-12 rounded-t-[3rem] mt-10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">

                    {/* Brand */}
                    <div className="space-y-6 max-w-sm">
                        <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                            Ghar<span className="text-brand-orange">Tak</span>
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            Simplifying urban living with technology.
                            One app for all your daily needs, delivered with love.
                        </p>
                        <div className="flex gap-4 pt-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors duration-300"
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 flex-1">
                        {Object.entries(links).map(([category, items]) => (
                            <div key={category}>
                                <h3 className="text-white font-bold mb-6 text-lg tracking-wide">{category}</h3>
                                <ul className="space-y-4">
                                    {items.map((item) => (
                                        <li key={item}>
                                            <a href="#" className="hover:text-brand-orange transition-colors duration-200 block text-sm">
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} GharTak Technologies Pvt. Ltd.</p>
                    <p className="flex items-center gap-1 mt-4 md:mt-0">
                        Made with <Heart className="w-4 h-4 text-brand-red fill-current animate-pulse" /> in India
                    </p>
                </div>
            </div>
        </footer>
    );
};

```

### File: src\components\layout\Header.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';

export const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Food', path: '/food' },
        { name: 'Grocery', path: '/grocery' },
        { name: 'Ride', path: '/ride' },
    ];

    // Determine header style based on page and scroll
    const isTranslucent = isHomePage && !scrolled;
    const headerBg = isTranslucent ? 'bg-transparent py-5' : 'bg-white shadow-sm py-3';
    const textColor = isTranslucent ? 'text-white' : 'text-gray-900';
    const navTextColor = isTranslucent ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-brand-orange';
    const actionBtnStyle = isTranslucent
        ? 'bg-white/10 text-white border-white/10 hover:bg-white/20'
        : 'bg-white text-gray-700 border-black/5 hover:bg-gray-50';
    const toggleStyle = isTranslucent ? 'text-white bg-white/10' : 'text-gray-600 bg-gray-100';

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-orange to-brand-red rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                        G
                    </div>
                    <span className={`text-2xl font-display font-bold tracking-tight transition-colors ${textColor}`}>
                        Ghar<span className="text-brand-orange">Tak</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`font-semibold transition-colors relative group ${navTextColor}`}
                        >
                            {link.name}
                            <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-brand-orange transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Button
                        variant="ghost"
                        className={`!p-2 relative rounded-xl transition-all shadow-sm border ${actionBtnStyle}`}
                        onClick={() => navigate('/cart')}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg"
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
                        Login / Sign Up
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className={`md:hidden p-2 rounded-xl transition-colors ${toggleStyle}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-white shadow-2xl p-6 md:hidden flex flex-col gap-4 rounded-b-[2rem] border-t border-gray-100"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-gray-700 font-bold py-3 px-4 hover:bg-brand-light rounded-xl transition-colors flex items-center justify-between"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                                <span className="text-brand-orange opacity-0 group-hover:opacity-100">→</span>
                            </Link>
                        ))}
                        <div className="flex flex-col gap-3 mt-4 border-t pt-6">
                            <Button variant="secondary" fullWidth onClick={() => { navigate('/cart'); setMobileMenuOpen(false); }}>
                                View Cart ({cartCount})
                            </Button>
                            <Button variant="primary" fullWidth onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                                Login
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};


```

### File: src\components\ui\Button.jsx

```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-brand-orange to-brand-red text-white hover:from-brand-red hover:to-brand-orange shadow-lg hover:shadow-brand-orange/40 focus:ring-brand-orange',
        secondary: 'bg-white text-brand-orange border-2 border-brand-orange hover:bg-brand-orange hover:text-white shadow-soft focus:ring-brand-orange',
        outline: 'bg-transparent text-gray-700 border-2 border-gray-200 hover:border-brand-orange hover:text-brand-orange focus:ring-gray-300',
        ghost: 'bg-transparent text-brand-orange hover:bg-brand-orange/10 focus:ring-brand-orange',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={twMerge(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
};

```

### File: src\context\CartContext.jsx

```jsx
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        // Increment total count
        setCartCount(prev => prev + 1);

        // Manage items array
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === product.id);
            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => {
            const item = prev.find(i => i.id === productId);
            if (!item) return prev;
            setCartCount(prevCount => Math.max(0, prevCount - item.quantity));
            return prev.filter(i => i.id !== productId);
        });
    };

    const clearCart = () => {
        setCartItems([]);
        setCartCount(0);
    };

    const value = useMemo(() => ({
        cartCount,
        cartItems,
        addToCart,
        removeFromCart,
        clearCart
    }), [cartCount, cartItems]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

```

### File: src\index.css

```css
@import "tailwindcss";

@theme {
  --color-brand-start: #ff4b1f;
  --color-brand-end: #ff9068;
  --color-brand-orange: #FF6B6B;
  --color-brand-red: #FF4757;
  --color-brand-pink: #FF70A6;
  --color-brand-coral: #FF9F43;
  --color-brand-yellow: #FECA57;
  --color-brand-light: #FFF5F5;

  --font-sans: 'Outfit', sans-serif;
  --font-display: 'Fredoka', sans-serif;

  --shadow-soft: 0 10px 40px -10px rgba(0, 0, 0, 0.08);
  --shadow-glow: 0 0 20px rgba(255, 107, 107, 0.5);

  --animate-float: float 6s ease-in-out infinite;
  --animate-fade-in: fadeIn 0.5s ease-out forwards;
  --animate-slide-up: slideUp 0.5s ease-out forwards;

  @keyframes float {

    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    0% {
      transform: translateY(20px);
      opacity: 0;
    }

    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
}

@layer base {
  body {
    @apply font-sans bg-brand-light text-gray-800 antialiased overflow-x-hidden;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-display font-semibold tracking-tight;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-brand-orange/30 rounded-full hover:bg-brand-orange/50 transition-colors;
}

/* Glassmorphism Utilities */
.glass {
  @apply bg-white/70 backdrop-blur-md border border-white/40 shadow-soft;
}

.glass-heavy {
  @apply bg-white/90 backdrop-blur-lg border border-white/50 shadow-lg;
}

.glass-card {
  @apply bg-white/80 backdrop-blur-sm border border-white/60 shadow-md hover:shadow-xl transition-all duration-300;
}

html {
  scroll-behavior: smooth;
}
```

### File: src\main.jsx

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

### File: package.json

```json
{
  "name": "ghartk",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "framer-motion": "^12.34.0",
    "lucide-react": "^0.563.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.0",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@tailwindcss/vite": "^4.1.18",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.24",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "vite": "^7.3.1"
  }
}

```

