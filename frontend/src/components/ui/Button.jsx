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
