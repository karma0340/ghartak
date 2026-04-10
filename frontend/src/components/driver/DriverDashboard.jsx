import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../../context/AuthContext';
import { useLiveRide } from '../../context/LiveRideContext';
import { Button } from '../ui/Button';
import { ChatModule } from '../ride/ChatModule';
import { 
    Power, Navigation, MapPin, 
    Clock, CheckCircle, Smartphone,
    DollarSign, Route, ChevronRight,
    Phone
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

// Reusable vehicle icon logic (similar to RidePage)
const vehicleIcon = (type, bearing) => {
    const iconUrl = `/vehicles/${type}.png`;
    const [w, h] = [32, 64]; 
    return L.divIcon({
        className: 'custom-driver-marker',
        html: `
            <div style="position: relative; width: ${w}px; height: ${h}px;">
                <div style="position: absolute; bottom: 8px; left: 50%; width: 24px; height: 12px; background: rgba(0,0,0,0.2); filter: blur(5px); transform: translateX(-50%); border-radius: 50%;"></div>
                <img src="${iconUrl}" style="width: 100%; height: 100%; transform: rotate(${bearing}deg); transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); transform-origin: center 75%;" />
            </div>
        `,
        iconSize: [w, h],
        iconAnchor: [w / 2, h * 0.75],
    });
};

const MapFocus = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, 16);
    }, [center, map]);
    return null;
};

async function getRoute(from, to) {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
        const d = await (await fetch(url)).json();
        if (d.routes?.[0]) return d.routes[0].geometry.coordinates.map(([ln, la]) => [la, ln]);
    } catch { }
    return null;
}

export const DriverDashboard = () => {
    const { user } = useAuth();
    const { 
        activeRide, setActiveRide, 
        nearbyRides, isOnline, toggleOnlineStatus, 
        driverProfile: profile, location, setLocation, 
        updateRideStatus, acceptRideRequest 
    } = useLiveRide();

    const [bearing, setBearing] = useState(0);
    const [stats, setStats] = useState({ earnings: 450, trips: 12, hours: 6.5 });
    const [routeCoords, setRouteCoords] = useState(null);
    const [otpInput, setOtpInput] = useState('');
    const [otpError, setOtpError] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        if (activeRide?.status === 'CANCELLED') {
            toast('The passenger has cancelled the ride.', 'error');
            setActiveRide(null);
            setRouteCoords(null);
        }
    }, [activeRide?.status, setActiveRide]);

    // 1. Real-time Location Tracking (watchPosition)
    useEffect(() => {
        if (!isOnline) return;

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setLocation(newLoc);
                if (pos.coords.heading) setBearing(pos.coords.heading);
                // Sync with backend natively
                if (user?.id) {
                    fetch((import.meta.env.VITE_API_URL || "") + '/api/drivers/location', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: user.id, ...newLoc })
                    }).catch(err => console.error('Loc sync err:', err));
                }
            },
            (err) => console.error('GPS error:', err),
            { enableHighAccuracy: true, distanceFilter: 5 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [isOnline, profile?._id, setLocation]);

    const handleAcceptRide = async (ride) => {
        await acceptRideRequest(ride);
    };

    const handleUpdateStatus = async (newStatus) => {
        if (newStatus === 'IN_PROGRESS') {
            if (otpInput.length !== 4) return setOtpError('Enter a 4-digit OTP');
            setOtpError('');
        }
        
        const res = await updateRideStatus(activeRide._id, newStatus, newStatus === 'IN_PROGRESS' ? otpInput : null);
        
        if (res.success) {
            if (newStatus === 'COMPLETED') {
                setRouteCoords(null);
                setStats(s => ({ ...s, trips: s.trips + 1, earnings: s.earnings + activeRide.price }));
            }
        } else {
            if (newStatus === 'IN_PROGRESS') setOtpError(res.error || 'Invalid OTP');
        }
    };

    // 2. Update Map Route based on Ride status
    useEffect(() => {
        if (!activeRide || !location) {
            setRouteCoords(null);
            return;
        }
        const fetchRoute = async () => {
            if (activeRide.status === 'ACCEPTED' || activeRide.status === 'ARRIVING') {
                if (activeRide.pickupCoords) {
                    const coords = await getRoute(location, activeRide.pickupCoords);
                    if (coords) setRouteCoords(coords);
                }
            } else if (activeRide.status === 'IN_PROGRESS') {
                if (activeRide.destinationCoords) {
                    const coords = await getRoute(location, activeRide.destinationCoords);
                    if (coords) setRouteCoords(coords);
                }
            }
        };
        fetchRoute();
    }, [activeRide?.status, activeRide?._id]);

    return (
        <div className="pt-20 min-h-screen bg-gray-50 flex flex-col items-center">
            {/* Top Bar / Status */}
            <div className={`w-full max-w-5xl px-4 py-3 mb-4 flex items-center justify-between transition-all duration-500 rounded-none md:rounded-3xl ${isOnline ? 'bg-green-500 text-white shadow-xl shadow-green-100' : 'bg-gray-200 text-gray-600'}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/20">
                        <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Device Status</p>
                        <p className="font-bold text-sm">{isOnline ? 'Online - System Active' : 'Offline - Tap to start'}</p>
                    </div>
                </div>
                <button onClick={toggleOnlineStatus} className={`p-3 rounded-2xl shadow-lg transform active:scale-95 transition-all ${isOnline ? 'bg-white text-green-500 hover:bg-green-50' : 'bg-brand-orange text-white hover:bg-brand-red'}`}>
                    <Power className="w-5 h-5" />
                </button>
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 pb-12">
                {/* Stats & Vehicle — hidden on mobile unless scrolled */}
                <div className="hidden lg:flex flex-col space-y-4">
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-500" /> Today's Earnings
                        </h3>
                        <div className="text-4xl font-display font-bold text-gray-900 mb-2">₹{stats.earnings}</div>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-green-500" /> +12% from yesterday
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-4">Your Vehicle</h3>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-3xl">
                            <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center p-2">
                                <img src={`/vehicles/${profile?.vehicleType || 'cab'}.png`} className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <div className="font-bold text-gray-900 uppercase">{profile?.vehicleType}</div>
                                <div className="text-xs text-gray-400 font-mono tracking-wider">{profile?.vehicleNumber}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    {/* Compact stats row visible on mobile only */}
                    <div className="flex lg:hidden gap-3 overflow-x-auto pb-1 no-scrollbar">
                        <div className="flex-shrink-0 bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="font-bold text-sm">₹{stats.earnings}</span>
                        </div>
                        <div className="flex-shrink-0 bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
                            <Route className="w-4 h-4 text-brand-orange" />
                            <span className="font-bold text-sm">{stats.trips} trips</span>
                        </div>
                        <div className="flex-shrink-0 bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="font-bold text-sm">{stats.hours}h online</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden h-[300px] md:h-[450px] relative">
                        <MapContainer center={[location?.lat || 30.7333, location?.lng || 76.7794]} zoom={15} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                            <MapFocus center={location ? [location.lat, location.lng] : null} />
                            
                            {location && (
                                <Marker position={[location.lat, location.lng]} icon={vehicleIcon(profile?.vehicleType || 'cab', bearing)} />
                            )}

                            {activeRide && activeRide.pickupCoords && (activeRide.status === 'ACCEPTED' || activeRide.status === 'ARRIVING') && (
                                <Marker 
                                    position={[activeRide.pickupCoords.lat, activeRide.pickupCoords.lng]} 
                                    icon={L.divIcon({
                                        html: `<div style="width:20px;height:20px;border-radius:50%;background:#10b981;border:3px solid #fff;box-shadow:0 0 10px rgba(16,185,129,0.4)"></div>`,
                                        iconSize: [20, 20], iconAnchor: [10, 10]
                                    })} 
                                />
                            )}
                            
                            {activeRide && activeRide.destinationCoords && activeRide.status === 'IN_PROGRESS' && (
                                <Marker 
                                    position={[activeRide.destinationCoords.lat, activeRide.destinationCoords.lng]} 
                                    icon={L.divIcon({
                                        html: `<div style="width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#f97316;border:3px solid #fff;box-shadow:0 4px 10px #f9731666"></div>`,
                                        iconSize: [24, 24], iconAnchor: [12, 24]
                                    })} 
                                />
                            )}
                            
                            {routeCoords && <Polyline positions={routeCoords} color="#f97316" weight={4} opacity={0.8} />}
                        </MapContainer>
                        
                        {!isOnline && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                                <div className="text-center p-8 bg-white rounded-[2rem] shadow-2xl border border-gray-100">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl mx-auto flex items-center justify-center mb-4">
                                        <Power className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="font-bold text-gray-900 text-xl mb-1">You are Offline</p>
                                    <p className="text-gray-400 text-sm">Go online to start seeing ride requests.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <AnimatePresence>
                        {isOnline && activeRide && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-brand-orange p-4 md:p-6 rounded-[2rem] text-white shadow-xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Current Task</h4>
                                        <p className="text-lg md:text-2xl font-bold">Passenger: {activeRide.user?.name}</p>
                                    </div>
                                    <div className="bg-white/20 px-3 py-1.5 rounded-xl text-base md:text-lg font-bold">₹{activeRide.price}</div>
                                </div>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500 border-4 border-white/20 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs uppercase opacity-70">Pickup</p>
                                            <p className="font-bold line-clamp-1">{activeRide.pickup}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white border-4 border-white/20 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs uppercase opacity-70">Destination</p>
                                            <p className="font-bold line-clamp-1">{activeRide.destination}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex gap-2">
                                        <a href={`tel:${activeRide.user?.phone || '0000000000'}`} className="flex-1">
                                            <Button variant="secondary" fullWidth className="h-12 rounded-2xl"><Phone className="w-4 h-4 mr-2"/> Call</Button>
                                        </a>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="secondary" fullWidth className="h-12 rounded-2xl text-blue-500"><CheckCircle className="w-4 h-4 mr-2"/> Details</Button>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col gap-3">
                                    {activeRide.status === 'ACCEPTED' && <Button variant="secondary" fullWidth className="bg-white text-brand-orange h-14 font-black" onClick={() => handleUpdateStatus('ARRIVING')}>Mark Arrived</Button>}
                                    
                                    {activeRide.status === 'ARRIVING' && (
                                        <div className="bg-gray-50 border border-gray-100 p-4 rounded-3xl flex items-center justify-between shadow-inner">
                                            <div className="flex-1 mr-4">
                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Enter Customer OTP</div>
                                                <input 
                                                    type="text" 
                                                    maxLength="4" 
                                                    value={otpInput} 
                                                    onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
                                                    className={`w-full bg-white border-2 text-xl font-bold tracking-[0.5em] text-center rounded-2xl py-2 outline-none transition-all ${otpError ? 'border-red-500 text-red-500' : 'border-emerald-100 focus:border-emerald-500'}`}
                                                    placeholder="____"
                                                />
                                                {otpError && <p className="text-red-500 text-xs font-bold mt-1 tracking-tight text-center">{otpError}</p>}
                                            </div>
                                            <Button variant="primary" className="bg-emerald-500 hover:bg-emerald-600 h-14 px-8 shadow-lg shadow-emerald-500/30" onClick={() => handleUpdateStatus('IN_PROGRESS')}>Start Trip</Button>
                                        </div>
                                    )}

                                    {activeRide.status === 'IN_PROGRESS' && <Button variant="secondary" fullWidth className="bg-brand-orange text-white hover:bg-orange-600 h-14 font-black text-lg" onClick={() => handleUpdateStatus('COMPLETED')}>Complete Trip</Button>}
                                    
                                    {activeRide.status !== 'IN_PROGRESS' && (
                                        <Button variant="ghost" fullWidth className="bg-white/10 border-none hover:bg-white/20 text-white" onClick={() => handleUpdateStatus('CANCELLED')}>Cancel Ride</Button>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {isOnline && !activeRide && nearbyRides.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 px-4 flex items-center gap-2">
                                    <Route className="w-4 h-4" /> Nearby Requests ({nearbyRides.length})
                                </h4>
                                {nearbyRides.map(ride => (
                                    <motion.div key={ride._id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-brand-orange transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center text-brand-orange font-bold text-lg">₹{ride.price}</div>
                                            <div>
                                                <div className="font-bold text-gray-900">{ride.pickup.split(',')[0]}</div>
                                                <div className="text-xs text-gray-400">To {ride.destination.split(',')[0]} • {ride.distance ? parseFloat(ride.distance).toFixed(1) : ''}km</div>
                                            </div>
                                        </div>
                                        <Button variant="primary" size="sm" onClick={() => handleAcceptRide(ride)}>Accept</Button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {isOnline && !activeRide && nearbyRides.length === 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-dashed border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="animate-pulse w-3 h-3 bg-brand-orange rounded-full shadow-[0_0_10px_rgba(255,107,0,0.5)]"></div>
                                    <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Awaiting new requests</p>
                                </div>
                                <Clock className="w-5 h-5 text-gray-200" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── CHAT OVERLAY ── */}
                    {isOnline && activeRide && (
                        <ChatModule ride={activeRide} user={user} />
                    )}
                </div>
            </div>
        </div>
    );
};

const TrendingUp = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
