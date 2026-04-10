import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { User, Car as Driver, CheckCircle, Smartphone } from 'lucide-react';

export const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('user'); // 'user' | 'driver'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
        const body = isLogin ? { email, password } : { name, email, password, role };

        try {
            const res = await fetch((import.meta.env.VITE_API_URL || '') + endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (res.ok) {
                if (isLogin) {
                    localStorage.setItem('ghartk_user', JSON.stringify(data));
                    setMessage('Login successful! Redirecting...');
                    setTimeout(() => {
                        window.location.href = '/'; // Refresh and redirect
                    }, 1000);
                } else {
                    setMessage('Registration successful! Please login.');
                    setIsLogin(true); // Switch to login form
                    // Clear signup specific state
                    setName('');
                    setPassword('');
                }
            } else {
                setMessage(data.error || 'An error occurred');
            }
        } catch (error) {
            setMessage('Network error');
        }
        setLoading(false);
    };

    return (
        <div className="pt-32 pb-20 px-4 min-h-screen bg-brand-light flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-soft border border-gray-100 w-full max-w-md mx-auto"
            >
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-display font-bold mb-2">
                        {isLogin ? 'Welcome Back!' : 'Join GharTk'}
                    </h2>
                    <p className="text-gray-500">
                        {isLogin ? 'Enter your credentials to continue' : 'Select your role and create account'}
                    </p>
                </div>

                {!isLogin && (
                    <div className="flex gap-4 mb-8">
                        {[
                            { id: 'user', label: 'Customer', icon: User },
                            { id: 'driver', label: 'Driver', icon: Driver }
                        ].map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setRole(r.id)}
                                className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === r.id ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-gray-50 text-gray-400 grayscale hover:grayscale-0'}`}
                            >
                                <r.icon className="w-6 h-6" />
                                <span className="text-sm font-bold">{r.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleAuth}>
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.input
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-orange outline-none"
                                required
                            />
                        )}
                    </AnimatePresence>
                    
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-orange outline-none"
                            required
                        />
                    </div>
                    
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-brand-orange outline-none"
                            required
                        />
                    </div>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-center p-3 rounded-xl text-sm font-bold ${message.includes('successful') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-brand-orange'}`}
                        >
                            {message}
                        </motion.div>
                    )}

                    <Button variant="primary" size="lg" fullWidth loading={loading}>
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            type="button"
                            onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
                            className="ml-2 text-brand-orange font-bold hover:underline"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
