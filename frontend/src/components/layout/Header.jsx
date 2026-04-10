import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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
    ];

    if (!user || user.role === 'user') {
        navLinks.push({ name: 'Ride', path: '/ride' });
    }

    if (!user) {
        navLinks.push({ name: 'Drive with Us', path: '/login' });
    } else if (user.role === 'admin') {
        navLinks.push({ name: 'Admin Dashboard', path: '/admin' });
    } else if (user.role === 'driver') {
        navLinks.push({ name: 'Driver Dashboard', path: '/driver' });
    }

    // Determine header style based on page and scroll
    const isHomePage = location.pathname === '/';
    const isTranslucent = isHomePage && !scrolled;

    const headerBg = isTranslucent
        ? 'bg-transparent py-5'
        : 'bg-white/95 backdrop-blur-xl shadow-md py-3 border-b border-gray-100';

    const brandTextColor = isTranslucent ? 'text-white' : 'text-gray-900';
    const navTextColor = isTranslucent ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-brand-orange';

    const actionBtnStyle = isTranslucent
        ? 'bg-white/10 text-white border-white/10 hover:bg-white/20'
        : 'bg-white text-gray-700 border-gray-200 hover:border-brand-orange hover:text-brand-orange';

    const toggleStyle = isTranslucent ? 'text-white bg-white/10' : 'text-gray-900 bg-gray-100';

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-orange to-brand-red rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                        G
                    </div>
                    <span className={`text-2xl font-display font-bold tracking-tight transition-colors drop-shadow-sm ${brandTextColor}`}>
                        Ghar<span className="text-brand-orange">Tak</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link key={link.name} to={link.path} className={`font-semibold transition-colors relative group ${navTextColor}`}>
                            {link.name}
                            <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-brand-orange transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <Button variant="ghost" className={`!p-2 relative rounded-xl shadow-sm border ${actionBtnStyle}`} onClick={() => navigate('/cart')}>
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                                {cartCount}
                            </motion.span>
                        )}
                    </Button>
                    
                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className={`font-bold text-sm ${brandTextColor}`}>{user.name.split(' ')[0]}</span>
                            <Button variant="primary" size="sm" onClick={logout}>Logout</Button>
                        </div>
                    ) : (
                        <Button variant="primary" size="sm" onClick={() => navigate('/login')}>Login / Sign Up</Button>
                    )}
                </div>

                <button className={`md:hidden p-2 rounded-xl transition-colors ${toggleStyle}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
                                <span className="text-brand-orange">→</span>
                            </Link>
                        ))}
                        <div className="flex flex-col gap-3 mt-4 border-t pt-6">
                            <Button variant="secondary" fullWidth onClick={() => { navigate('/cart'); setMobileMenuOpen(false); }}>
                                🛒 View Cart ({cartCount})
                            </Button>
                            {user ? (
                                <div className="flex flex-col gap-2">
                                    <p className="text-center text-sm text-gray-500 font-medium">Signed in as <strong>{user.name}</strong></p>
                                    <Button variant="primary" fullWidth onClick={() => { logout(); setMobileMenuOpen(false); }}>Logout</Button>
                                </div>
                            ) : (
                                <Button variant="primary" fullWidth onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Login / Sign Up</Button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

