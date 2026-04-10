import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, X, MessageSquare, 
    Smartphone, MapPin, Loader2,
    Smile, PlusCircle
} from 'lucide-react';
import { Button } from '../ui/Button';

export const ChatModule = ({ ride, user, isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    // Poll for new messages every 3 seconds
    useEffect(() => {
        if (!isOpen) return;
        const fetchMessages = async () => {
            try {
                if (!ride?._id) return;
                const res = await fetch(`/api/rides/${ride._id}/chat`);
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (err) { console.error('Chat fetch error:', err); }
            finally { setLoading(false); }
        };

        const interval = setInterval(fetchMessages, 3000);
        fetchMessages();
        return () => clearInterval(interval);
    }, [isOpen, ride?._id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        
        try {
            const res = await fetch(`/api/rides/${ride._id}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender: user.id, text: inputText })
            });
            if (res.ok) {
                const newMessage = await res.json();
                setMessages([...messages, newMessage]);
                setInputText('');
            }
        } catch (err) { console.error('Send error:', err); }
    };

    const quickMessages = [
        "Hey, where are you?",
        "Wait a minute, I'm coming.",
        "I'm at the entry gate.",
        "Wait for 5 mins please."
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed inset-0 sm:inset-auto sm:bottom-4 sm:right-6 z-[200] sm:w-[350px] h-[100dvh] sm:h-[500px] bg-white rounded-none sm:rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-gray-100 flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gray-900 p-5 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center font-bold">
                                {user.role === 'driver' ? ride.user?.name[0] : ride.driver?.name[0]}
                            </div>
                            <div>
                                <div className="font-bold text-sm">
                                    Chat with {user.role === 'driver' ? ride.user?.name : ride.driver?.name}
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-green-400 font-bold">Online</div>
                            </div>
                        </div>
                        <button 
                            type="button"
                            onClick={onClose} 
                            className="p-2 hover:bg-white/10 rounded-xl"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                {loading && messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.sender === user.id;
                        return (
                            <motion.div 
                                key={i}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
                                    isMe 
                                    ? 'bg-brand-orange text-white rounded-br-none' 
                                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                }`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
                {quickMessages.map(qm => (
                    <button 
                        key={qm}
                        onClick={() => setInputText(qm)}
                        className="whitespace-nowrap bg-white px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-bold text-gray-500 hover:border-brand-orange hover:text-brand-orange transition-all"
                    >
                        {qm}
                    </button>
                ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
                <button type="button" className="text-gray-400">
                    <PlusCircle className="w-6 h-6" />
                </button>
                <input 
                    className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                    placeholder="Type a message..."
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                />
                <button 
                    type="submit"
                    className="bg-brand-orange text-white p-3 rounded-xl shadow-lg shadow-brand-orange/20 disabled:opacity-50"
                    disabled={!inputText.trim()}
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </motion.div>
    )}
    </AnimatePresence>
    );
};
