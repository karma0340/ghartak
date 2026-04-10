import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Apple, Play, Check } from 'lucide-react';


export const FinalCTA = () => {
    const navigate = useNavigate();


    return (
        <section className="py-24 px-4 bg-[#0a0f1a] relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[120%] bg-brand-orange/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[120%] bg-brand-red/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto max-w-5xl relative z-10">
                <div className="bg-[#1a1f2e] rounded-[3rem] p-8 md:p-16 border border-white/10 text-center shadow-2xl relative z-20">

                    <h2 className="text-4xl md:text-6xl font-bold font-display text-white mb-6 leading-tight">
                        Ready to experience the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">
                            Future of Super Apps?
                        </span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                        Join millions of happy users who save time every day.
                        Download now and get your first delivery free!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-4 bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-gray-100 transition-all w-full sm:w-auto"
                        >
                            <Apple className="w-8 h-8" />
                            <div className="text-left">
                                <div className="text-[10px] uppercase font-bold opacity-60">Download on the</div>
                                <div className="text-lg leading-none">App Store</div>
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-4 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold border border-white/10 hover:bg-gray-800 transition-all w-full sm:w-auto shadow-xl"
                        >
                            <Play className="w-8 h-8 text-brand-orange fill-brand-orange" />
                            <div className="text-left">
                                <div className="text-[10px] uppercase font-bold opacity-60">Get it on</div>
                                <div className="text-lg leading-none">Google Play</div>
                            </div>
                        </motion.button>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-400 font-medium">
                        <span className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-emerald-500" /> No Credit Card Needed
                        </span>
                        <span className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-emerald-500" /> Free Installation
                        </span>
                        <span className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-emerald-500" /> 24/7 Support
                        </span>
                    </div>
                </div>

            </div>
        </section>
    );
};


