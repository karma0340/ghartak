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
                            initial={{ opacity: 1, y: 0 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
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
