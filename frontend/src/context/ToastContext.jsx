import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const toast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed top-4 right-0 left-0 sm:left-auto sm:right-4 z-[9999] flex flex-col items-center sm:items-end gap-2 px-4 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="bg-white pointer-events-auto shadow-2xl rounded-2xl p-4 flex items-center min-w-[300px] border border-gray-100"
                        >
                            <div className="flex-shrink-0 mr-3">
                                {t.type === 'success' && <CheckCircle className="w-6 h-6 text-green-500" />}
                                {t.type === 'error' && <AlertCircle className="w-6 h-6 text-red-500" />}
                                {t.type === 'info' && <Info className="w-6 h-6 text-blue-500" />}
                            </div>
                            <div className="flex-1 mr-4">
                                <p className="text-sm font-bold text-gray-800">{t.message}</p>
                            </div>
                            <button onClick={() => removeToast(t.id)} className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
