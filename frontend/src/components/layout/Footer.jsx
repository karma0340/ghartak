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
