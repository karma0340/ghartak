import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { 
    Users, Car, Banknote, Map as MapIcon, 
    CheckCircle, XCircle, Clock, Search,
    ArrowUpRight, TrendingUp
} from 'lucide-react';

export const AdminDashboard = () => {
    const [stats, setStats] = useState({ userCount: 0, rideCount: 0, driverCount: 0, revenue: 0 });
    const [applications, setApplications] = useState([]);
    const [activeTab, setActiveTab] = useState('drivers'); // 'drivers' | 'rides' | 'stats'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, appsRes] = await Promise.all([
                fetch((import.meta.env.VITE_API_URL || "") + '/api/admin/stats'),
                fetch((import.meta.env.VITE_API_URL || "") + '/api/admin/drivers')
            ]);
            setStats(await statsRes.json());
            setApplications(await appsRes.json());
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
        setLoading(false);
    };

    const handleStatusUpdate = async (profileId, status) => {
        try {
            const res = await fetch((import.meta.env.VITE_API_URL || "") + '/api/admin/drivers/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileId, status })
            });
            if (res.ok) fetchData();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return <div className="pt-32 text-center font-bold text-gray-400">Loading Dashboard...</div>;

    return (
        <div className="pt-28 pb-20 px-4 md:px-8 min-h-screen bg-gray-50 flex flex-col gap-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold text-gray-900">Admin Control Center</h1>
                    <p className="text-gray-500">Platform overview and driver management</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary"><Search className="w-4 h-4 mr-2" /> Search</Button>
                    <Button variant="primary">Export Data</Button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Users', value: stats.userCount, icon: Users, color: 'blue' },
                    { label: 'Active Drivers', value: stats.driverCount, icon: Car, color: 'green' },
                    { label: 'Total Rides', value: stats.rideCount, icon: MapIcon, color: 'orange' },
                    { label: 'Total Revenue', value: `₹${stats.revenue}`, icon: Banknote, color: 'purple' },
                ].map((s, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5"
                    >
                        <div className={`w-14 h-14 rounded-2xl bg-${s.color}-50 flex items-center justify-center`}>
                            <s.icon className={`w-7 h-7 text-${s.color}-500`} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 font-medium">{s.label}</div>
                            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
                <div className="flex border-b border-gray-100">
                    {[
                        { id: 'drivers', label: 'Driver Applications', count: applications.filter(a => a.status === 'PENDING').length },
                        { id: 'rides', label: 'Active Rides', count: 0 },
                        { id: 'stats', label: 'Detailed Analytics' }
                    ].map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)} 
                            className={`px-8 py-5 font-bold transition-all relative ${activeTab === t.id ? 'text-brand-orange' : 'text-gray-400 hover:text-gray-600'}`}>
                            {t.label}
                            {t.count > 0 && <span className="ml-2 bg-brand-orange text-white text-[10px] px-1.5 py-0.5 rounded-full">{t.count}</span>}
                            {activeTab === t.id && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-orange" />}
                        </button>
                    ))}
                </div>

                <div className="p-6 md:p-8 flex-grow">
                    <AnimatePresence mode="wait">
                        {activeTab === 'drivers' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-gray-400 text-sm font-bold border-b border-gray-50">
                                                <th className="pb-4 px-4 uppercase tracking-wider">Driver</th>
                                                <th className="pb-4 px-4 uppercase tracking-wider">Vehicle Details</th>
                                                <th className="pb-4 px-4 uppercase tracking-wider">License</th>
                                                <th className="pb-4 px-4 uppercase tracking-wider">Status</th>
                                                <th className="pb-4 px-4 uppercase tracking-wider text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applications.map((app, i) => (
                                                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                                    <td className="py-5 px-4">
                                                        <div className="font-bold text-gray-900">{app.user?.name}</div>
                                                        <div className="text-xs text-gray-400">{app.user?.email}</div>
                                                    </td>
                                                    <td className="py-5 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{app.vehicleType}</span>
                                                            <span className="font-medium text-gray-700">{app.vehicleModel}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-1">{app.vehicleNumber}</div>
                                                    </td>
                                                    <td className="py-5 px-4 font-mono text-sm text-gray-600">{app.licenseNumber}</td>
                                                    <td className="py-5 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                                                            app.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 
                                                            app.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                                                        }`}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 px-4 text-right">
                                                        {app.status === 'PENDING' ? (
                                                            <div className="flex justify-end gap-2">
                                                                <button onClick={() => handleStatusUpdate(app._id, 'APPROVED')} className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"><CheckCircle className="w-5 h-5" /></button>
                                                                <button onClick={() => handleStatusUpdate(app._id, 'REJECTED')} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"><XCircle className="w-5 h-5" /></button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-300 text-xs italic">Decision Finalized</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {applications.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="py-20 text-center text-gray-400 font-medium italic">No driver applications found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'rides' && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <Clock className="w-12 h-12 text-gray-200 mb-4" />
                                <h4 className="text-lg font-bold text-gray-400">Live Ride Monitoring Coming Soon</h4>
                                <p className="text-sm text-gray-300">Tracking systems are currently initializing...</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
