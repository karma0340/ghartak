import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, Navigation, Clock, Shield, Star, Info, Loader2, 
    CheckCircle2, X, LocateFixed, Car, ChevronUp, Phone, MessageSquare 
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SearchingView } from '../ride/SearchingView';
import { ChatModule } from '../ride/ChatModule';
import { useAuth } from '../../context/AuthContext';
import { useLiveRide } from '../../context/LiveRideContext';
import { Button } from '../ui/Button';
import { CancelRideModal } from '../ride/CancelRideModal';
import { useToast } from '../../context/ToastContext';

// ─── Leaflet icon fix for Vite ───────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─── Constants ───────────────────────────────────────────────────────────────
const RIDE_META = {
    bike: { name: 'Ghar Bike',  emoji: '🛵', desc: 'Fastest for city traffic',   rating: 4.8, priceKm: 11, minFare: 25,  trafficFactor: 0.82, color: '#f97316', avgSpeedKmH: 28 },
    auto: { name: 'Ghar Auto',  emoji: '🛺', desc: 'Comfortable & economical',   rating: 4.7, priceKm: 16, minFare: 49,  trafficFactor: 1.05, color: '#eab308', avgSpeedKmH: 22 },
    cab:  { name: 'Ghar Prime', emoji: '🚗', desc: 'Top-rated drivers & AC',     rating: 4.9, priceKm: 22, minFare: 99,  trafficFactor: 1.00, color: '#6366f1', avgSpeedKmH: 24 },
    xl:   { name: 'Ghar XL',    emoji: '🚐', desc: 'For larger groups (6 seats)', rating: 4.9, priceKm: 30, minFare: 149, trafficFactor: 1.15, color: '#0ea5e9', avgSpeedKmH: 20 },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function fmtTime(seconds) {
    if (!seconds) return null;
    const m = Math.round(seconds / 60);
    if (m < 1) return '< 1 min';
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60), rem = m % 60;
    return rem ? `${h}h ${rem}m` : `${h}h`;
}

function computePrice(rideId, distKm) {
    if (!distKm) return null;
    const { priceKm, minFare } = RIDE_META[rideId];
    const raw = priceKm * distKm;
    return Math.max(Math.round(raw / 5) * 5, minFare);
}

function computeETA(rideId, osrmDurationSec) {
    if (!osrmDurationSec) return null;
    const { trafficFactor } = RIDE_META[rideId];
    return fmtTime(osrmDurationSec * trafficFactor);
}

// ─── API helpers ─────────────────────────────────────────────────────────────
async function searchPlaces(q) {
    if (!q || q.length < 3) return [];
    try {
        const r = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
        );
        return r.json();
    } catch { return []; }
}

async function reverseGeocode(lat, lng) {
    try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const d = await r.json();
        return d.display_name?.split(',').slice(0, 3).join(',') || 'Current Location';
    } catch { return 'Current Location'; }
}

async function getRoute(from, to) {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
        const d = await (await fetch(url)).json();
        if (d.routes?.[0]) return {
            coords:      d.routes[0].geometry.coordinates.map(([ln, la]) => [la, ln]),
            distanceKm:  d.routes[0].distance / 1000,
            durationSec: d.routes[0].duration,
        };
    } catch { }
    return null;
}

function useDebounce(val, ms) {
    const [deb, setDeb] = useState(val);
    useEffect(() => { const t = setTimeout(() => setDeb(val), ms); return () => clearTimeout(t); }, [val, ms]);
    return deb;
}

const VEHICLE_TYPES_PER_CENTER = { bike: 4, auto: 3, cab: 3, xl: 2 };

function generateVehicles(center) {
    const vehicles = [];
    Object.entries(VEHICLE_TYPES_PER_CENTER).forEach(([type, count]) => {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const dist  = 0.3 + Math.random() * 1.5;
            const latOff = (dist / 111) * Math.cos(angle);
            const lngOff = (dist / (111 * Math.cos(center.lat * Math.PI / 180))) * Math.sin(angle);
            vehicles.push({
                id:      `${type}-${i}`,
                type,
                lat:     center.lat + latOff,
                lng:     center.lng + lngOff,
                bearing: Math.random() * 360,
                status:  'moving',
                idleTicks: 0,
            });
        }
    });
    return vehicles;
}

function vehicleIcon(type, bearing, selected) {
    const scale = selected ? 1.4 : 1.0;
    const iconUrl = `/vehicles/${type}.png`;
    const offsets = { bike: 0, auto: 0, cab: 0, xl: 0 };
    const sizes = { bike: [28, 56], auto: [40, 52], cab: [32, 64], xl: [38, 76] };
    const [w, h] = sizes[type].map(s => s * scale);

    return L.divIcon({
        html: `<div style="width:${w}px;height:${h}px;position:relative; display:flex; align-items:center; justify-content:center;">
                 <div style="position:absolute; bottom:15%; width:70%; height:20%; background:rgba(0,0,0,0.25); border-radius:50%; filter:blur(3px); transform:rotate(${bearing}deg); z-index:0;"></div>
                 <img src="${iconUrl}" 
                      style="width:100%; height:100%; object-fit:contain; position:relative; z-index:1; transform:rotate(${bearing + (offsets[type] || 0)}deg); transition:transform 0.6s ease; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.15));" 
                 />
               </div>`,
        iconSize: [w, h],
        iconAnchor: [w / 2, h * 0.75],
        className: 'vehicle-marker-icon'
    });
}

function LocationInput({ placeholder, value, onSelect, dotColor }) {
    const [query, setQuery] = useState(value?.label || '');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const debQ = useDebounce(query, 380);
    const ref = useRef(null);

    useEffect(() => { if (value?.label && value.label !== query) setQuery(value.label); }, [value?.label]);

    useEffect(() => {
        if (!debQ || debQ === value?.label) { setResults([]); return; }
        setLoading(true);
        searchPlaces(debQ).then(r => { setResults(r); setOpen(r.length > 0); setLoading(false); });
    }, [debQ]);

    useEffect(() => {
        const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const handleSelect = place => {
        const label = place.display_name.split(',').slice(0, 3).join(',').trim();
        setQuery(label);
        setOpen(false);
        onSelect({ label, lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
    };

    return (
        <div ref={ref} className="relative">
            <div className="relative flex items-center">
                <div className={`absolute left-4 z-10 w-2.5 h-2.5 rounded-full ${dotColor}`} />
                <input
                    className="w-full pl-10 pr-8 py-3.5 rounded-xl bg-gray-100 focus:bg-white border-2 border-transparent focus:border-orange-300 outline-none text-sm font-medium transition-all"
                    placeholder={placeholder} value={query} onChange={e => setQuery(e.target.value)}
                />
            </div>
            <AnimatePresence>
                {open && (
                    <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                        className="absolute z-[9999] top-full mt-1.5 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
                        {results.map((p, i) => (
                            <li key={i} onClick={() => handleSelect(p)} className="px-4 py-3 cursor-pointer hover:bg-orange-50 border-b border-gray-50 text-sm">
                                {p.display_name.split(',').slice(0, 3).join(',')}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}

function RideMap({ pickup, destination, userLoc, selectedRide, bookedVehicle }) {
    const mapDivRef = useRef(null);
    const mapRef = useRef(null);
    const mapReadyRef = useRef(false);
    const vehicleMarkersRef = useRef({});
    const birdsEyeMarkerRef = useRef(null);
    const vehiclesRef = useRef([]);
    const tickRef = useRef(null);
    const [mapReady, setMapReady] = useState(false);
    const pickupMarkerRef = useRef(null);
    const destMarkerRef = useRef(null);
    const routeLayerRef = useRef(null);

    useEffect(() => {
        if (mapRef.current) return;
        const map = L.map(mapDivRef.current, { zoomControl: false, attributionControl: false });
        L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
        map.setView([20.5937, 78.9629], 15); // Default to closeup zoom level
        map.whenReady(() => {
            mapRef.current = map;
            mapReadyRef.current = true;
            setMapReady(true);
        });
        return () => { mapReadyRef.current = false; map.remove(); mapRef.current = null; };
    }, []);

    useEffect(() => {
        if (!mapReady || !pickup) return;
        if (tickRef.current) clearInterval(tickRef.current);
        Object.values(vehicleMarkersRef.current).forEach(m => m.remove());
        vehicleMarkersRef.current = {};

        if (bookedVehicle) return; // Simulation off if booked

        const baseVehicles = generateVehicles(pickup);
        vehiclesRef.current = baseVehicles;
        baseVehicles.forEach(v => {
            const marker = L.marker([v.lat, v.lng], { icon: vehicleIcon(v.type, v.bearing, v.type === selectedRide) }).addTo(mapRef.current);
            vehicleMarkersRef.current[v.id] = marker;
        });

        tickRef.current = setInterval(() => {
            vehiclesRef.current = vehiclesRef.current.map(v => {
                const step = 0.0004;
                const newLat = v.lat + Math.cos(v.bearing * Math.PI / 180) * step;
                const newLng = v.lng + Math.sin(v.bearing * Math.PI / 180) * step;
                const marker = vehicleMarkersRef.current[v.id];
                if (marker) {
                    marker.setLatLng([newLat, newLng]);
                    marker.setIcon(vehicleIcon(v.type, v.bearing, v.type === selectedRide));
                }
                return { ...v, lat: newLat, lng: newLng };
            });
        }, 2000);
        return () => clearInterval(tickRef.current);
    }, [mapReady, pickup, selectedRide, bookedVehicle]);

    // Pickup & Destination Markers
    useEffect(() => {
        if (!mapReady) return;
        if (pickupMarkerRef.current) pickupMarkerRef.current.remove();
        if (destMarkerRef.current) destMarkerRef.current.remove();
        if (routeLayerRef.current) routeLayerRef.current.remove();

        if (pickup) {
            const icon = L.divIcon({
                html: `<div style="width:20px;height:20px;border-radius:50%;background:#10b981;border:3px solid #fff;box-shadow:0 0 10px rgba(16,185,129,0.4)"></div>`,
                iconSize: [20, 20], iconAnchor: [10, 10], className: ''
            });
            pickupMarkerRef.current = L.marker([pickup.lat, pickup.lng], { icon, zIndexOffset: 1000 }).addTo(mapRef.current);
        }

        if (destination) {
            const icon = L.divIcon({
                html: `<div style="width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#f97316;border:3px solid #fff;box-shadow:0 4px 10px #f9731666"></div>`,
                iconSize: [24, 24], iconAnchor: [12, 24], className: ''
            });
            destMarkerRef.current = L.marker([destination.lat, destination.lng], { icon, zIndexOffset: 1000 }).addTo(mapRef.current);
        }

        if (pickup && destination) {
            getRoute(pickup, destination).then(r => {
                if (r && mapRef.current) {
                    routeLayerRef.current = L.polyline(r.coords, { color: '#f97316', weight: 4, opacity: 0.8 }).addTo(mapRef.current);
                    mapRef.current.fitBounds(L.latLngBounds([[pickup.lat, pickup.lng], [destination.lat, destination.lng]]), { padding: [100, 100] });
                }
            });
        } else if (pickup) {
            mapRef.current.setView([pickup.lat, pickup.lng], 16);
        }
    }, [mapReady, pickup, destination]);

    useEffect(() => {
        if (!mapReady || !bookedVehicle) return;
        if (!birdsEyeMarkerRef.current) {
            birdsEyeMarkerRef.current = L.marker([bookedVehicle.lat, bookedVehicle.lng], { 
                icon: vehicleIcon(bookedVehicle.type, bookedVehicle.bearing || 0, true) 
            }).addTo(mapRef.current);
        } else {
            birdsEyeMarkerRef.current.setLatLng([bookedVehicle.lat, bookedVehicle.lng]);
            birdsEyeMarkerRef.current.setIcon(vehicleIcon(bookedVehicle.type, bookedVehicle.bearing || 0, true));
        }
    }, [mapReady, bookedVehicle]);

    return <div ref={mapDivRef} className="w-full h-full" />;
}

export const RidePage = () => {
    const [selectedRide, setSelectedRide] = useState('cab');
    const [pickup, setPickup] = useState(null);
    const [destination, setDestination] = useState(null);
    const [userLoc, setUserLoc] = useState(null);
    const [route, setRoute] = useState(null);
    const [booked, setBooked] = useState(false);
    const { user } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);
    const { activeRide, setActiveRide, cancelRideRequest } = useLiveRide();
    const [bookedVehicle, setBookedVehicle] = useState(null);
    const [driverProfile, setDriverProfile] = useState(null);
    const [status, setStatus] = useState(null);
    const [locating, setLocating] = useState(false);
    const [nearestArrival, setNearestArrival] = useState({});
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (pickup && destination) getRoute(pickup, destination).then(r => setRoute(r));
    }, [pickup, destination]);

    // Auto-detect location on mount ONLY (not tied to activeRide)
    useEffect(() => {
        detectLocation();
    }, []);

    // React to activeRide changes: if we have an active ride, mark as booked
    useEffect(() => {
        if (activeRide) {
            setBooked(true);
        }
    }, [activeRide?._id, activeRide?.status]);

    // Fetch and poll driver details if ride assigned
    useEffect(() => {
        if (!activeRide) return;
        let poll;
        
        const fetchDriver = async () => {
            if (['ACCEPTED', 'ARRIVING', 'IN_PROGRESS'].includes(activeRide.status)) {
                if (activeRide.driver) {
                    try {
                        const dRes = await fetch(`/api/drivers/profile/${activeRide.driver._id || activeRide.driver}`);
                        if (dRes.ok) {
                            const dData = await dRes.json();
                            setDriverProfile(dData);
                            if (dData.currentLocation) {
                                setBookedVehicle({ type: activeRide.rideType, lat: dData.currentLocation.lat, lng: dData.currentLocation.lng });
                            }
                        }
                    } catch(err) { console.error('Driver fetch err:', err) }
                }
            } else if (activeRide.status === 'CANCELLED') {
               setBooked(false);
               setBookedVehicle(null);
               setDriverProfile(null);
               setActiveRide(null);
               setPickup(null);
               setDestination(null);
               if (activeRide.cancelReason) {
                   toast("Ride cancelled: " + activeRide.cancelReason, "error");
               } else {
                   toast("Your captain cancelled the ride.", "error");
               }
            }
        };

        fetchDriver();
        
        // Continuously poll driver location while ride is active
        if (['ACCEPTED', 'ARRIVING', 'IN_PROGRESS'].includes(activeRide.status)) {
            poll = setInterval(fetchDriver, 4000);
        }

        return () => {
            if (poll) clearInterval(poll);
        };
    }, [activeRide?.status, activeRide?.driver, activeRide?.cancelReason]);

    const handleConfirm = async () => {
        if (!pickup || !destination) return setStatus({ type: 'error', message: 'Set locations first' });
        setStatus({ type: 'loading', message: 'Booking...' });
        const res = await fetch('/api/rides', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user?.id || 'guest', pickup: pickup.label, destination: destination.label,
                pickupCoords: pickup, destinationCoords: destination, 
                price: computePrice(selectedRide, route?.distanceKm), rideType: selectedRide,
                distance: route?.distanceKm
            })
        });
        if (res.ok) { setActiveRide(await res.json()); setBooked(true); setStatus(null); }
    };

    const handleBoostPrice = async (amount) => {
        const res = await fetch('/api/rides/price', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rideId: activeRide._id, price: activeRide.price + amount })
        });
        if (res.ok) setActiveRide(await res.json());
    };

    const handleCancelRide = async (reason) => {
        setCancelling(true);
        const success = await cancelRideRequest(activeRide._id, reason);
        if (success) {
            setBooked(false);
            setBookedVehicle(null);
            setCancelModalOpen(false);
            setPickup(null);
            setDestination(null);
        }
        setCancelling(false);
    };

    const detectLocation = () => {
        if (!navigator.geolocation) return;
        setLocating(true);
        navigator.geolocation.getCurrentPosition(async ({ coords: { latitude: lat, longitude: lng } }) => {
            const label = await reverseGeocode(lat, lng);
            const loc = { lat, lng, label };
            setPickup(loc);
            setUserLoc(loc);
            setLocating(false);
        }, (err) => {
            console.error('Location error:', err);
            setLocating(false);
        }, { enableHighAccuracy: true });
    };

    const selected = RIDE_META[selectedRide];

    return (
        <div className="relative min-h-screen bg-gray-100 flex flex-col overflow-hidden" style={{ paddingTop: '72px' }}>
            {/* Map fills full screen on all sizes */}
            <div className="absolute inset-0 top-[72px] z-0">
                <RideMap pickup={pickup} destination={destination} selectedRide={selectedRide} bookedVehicle={bookedVehicle} />
            </div>

            {/* Side / Bottom panel - use pointer-events-none on wrapper so map is clickable */}
            <div className="relative z-10 flex flex-col lg:flex-row h-full pointer-events-none" style={{ minHeight: 'calc(100vh - 72px)' }}>
                {/* Panel: full-width on mobile (bottom sheet), left sidebar on desktop - pointer-events-auto to restore interaction */}
                <motion.div
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className={`w-full lg:w-[420px] bg-white shadow-2xl flex flex-col overflow-hidden
                               fixed bottom-0 left-0 right-0 lg:max-h-none
                               lg:relative lg:bottom-auto rounded-t-[2.5rem] lg:rounded-none
                               z-20 transition-all duration-500 pointer-events-auto
                               ${isExpanded ? 'h-[75vh] lg:h-auto' : 'h-[100px] lg:h-auto'}`}
                >
                    {/* Mobile Drag/Collapse Handle */}
                    <div 
                        className="lg:hidden w-full pt-4 pb-2 flex justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <div className={`w-12 h-1.5 rounded-full transition-all ${isExpanded ? 'bg-gray-200' : 'bg-brand-orange animate-pulse shadow-[0_0_8px_rgba(255,100,0,0.4)]'}`} />
                    </div>

                    {/* Planning Form (Visible on desktop or when expanded on mobile, hidden if booked) */}
                    {!booked && (
                        <div className={`p-6 border-b space-y-4 flex-shrink-0 ${!isExpanded ? 'hidden lg:block' : ''}`}>
                            <h1 className="text-2xl font-black">Plan your ride</h1>
                            <LocationInput placeholder="Pickup" value={pickup} onSelect={setPickup} dotColor="bg-emerald-500" />
                            <LocationInput placeholder="Drop-off" value={destination} onSelect={setDestination} dotColor="bg-orange-500" />
                            <button onClick={detectLocation} className="text-xs font-bold text-brand-orange">
                                {locating ? 'Locating...' : 'Use current location'}
                            </button>
                        </div>
                    )}

                    {/* Minimal status for collapsed mobile view */}
                    {!isExpanded && !booked && (
                        <div className="lg:hidden px-6 py-4 flex items-center justify-between border-t border-gray-50">
                            <div className="flex-1 truncate pr-4">
                                <p className="text-[10px] uppercase font-bold text-gray-400">Heading to</p>
                                <p className="text-sm font-bold truncate text-gray-900">{destination?.label || 'Select destination'}</p>
                            </div>
                            <Button variant="secondary" size="sm" className="rounded-xl shadow-sm" onClick={() => setIsExpanded(true)}>Options</Button>
                        </div>
                    )}

                    {/* Main Content Area (Scrollable) */}
                    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                        <AnimatePresence mode="wait">
                            {!booked ? (
                                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
                                    <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                                        {Object.entries(RIDE_META).map(([id, meta]) => (
                                            <button 
                                                key={id} 
                                                onClick={() => setSelectedRide(id)} 
                                                className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${selectedRide === id ? 'border-brand-orange bg-orange-50 shadow-sm' : 'border-transparent bg-gray-50'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="text-2xl">{meta.emoji}</div>
                                                    <div className="text-left">
                                                        <div className="font-bold text-sm text-gray-900">{meta.name}</div>
                                                        <div className="text-[10px] text-gray-400">Arrives in {Math.floor(Math.random() * 5) + 1} min</div>
                                                    </div>
                                                </div>
                                                <div className="font-bold text-sm text-gray-900">₹{computePrice(id, route?.distanceKm) || '--'}</div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="p-6 border-t bg-white flex-shrink-0">
                                        <Button variant="primary" fullWidth size="lg" onClick={handleConfirm} disabled={status?.type==='loading'}>
                                            {status?.type==='loading' ? 'Requesting...' : `Book ${selected.name}`}
                                        </Button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col overflow-hidden">
                                    {activeRide?.status === 'PENDING' ? (
                                        <SearchingView ride={activeRide} onBoost={handleBoostPrice} onCancel={handleCancelRide} />
                                    ) : (
                                        <div className="flex flex-col h-full bg-white">
                                            <div className="p-6 md:p-8 flex-1 space-y-6 md:space-y-8 overflow-y-auto no-scrollbar">
                                                <div className="flex items-center gap-4 md:gap-5">
                                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-light rounded-2xl md:rounded-3xl flex items-center justify-center p-3 md:p-4 shadow-inner relative flex-shrink-0">
                                                        <img src={`/vehicles/${activeRide?.rideType}.png`} className="w-full h-full object-contain" />
                                                        <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 bg-brand-orange text-white text-[8px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-full font-black shadow-lg">
                                                            {driverProfile?.vehicleType?.toUpperCase() || 'GHARTAK'}
                                                        </div>
                                                    </div>
                                                    <div key={activeRide?.status} className="flex-1 truncate">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-lg md:text-xl font-black text-gray-900 leading-tight truncate">{activeRide?.driver?.name}</h3>
                                                            <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded-lg text-[9px] md:text-[10px] font-bold text-gray-500 flex-shrink-0">
                                                                <Star className="w-3 h-3 text-brand-orange fill-brand-orange" /> 4.9
                                                            </div>
                                                        </div>
                                                        <p className="text-xs md:text-sm font-bold text-gray-400 mb-1 md:mb-2 uppercase tracking-tight truncate">
                                                            {driverProfile?.vehicleModel} • <span className="text-brand-orange font-mono">{driverProfile?.vehicleNumber}</span>
                                                        </p>
                                                        
                                                        {activeRide?.status === 'ACCEPTED' && (
                                                            <div className="flex flex-col gap-1">
                                                                <div className="w-fit px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100/50">
                                                                    Captain is on the way 🔥
                                                                </div>
                                                                <div className="text-[9px] text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded-full w-fit">ETA: ~4 mins</div>
                                                            </div>
                                                        )}
                                                        {activeRide?.status === 'ARRIVING' && (
                                                            <div className="w-fit px-2 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-100/50">
                                                                Captain Arrived at pickup 📍
                                                            </div>
                                                        )}
                                                        {activeRide?.status === 'IN_PROGRESS' && (
                                                            <div className="w-fit px-2 py-1 bg-orange-50 text-brand-orange rounded-full text-[9px] font-black uppercase tracking-widest border border-brand-orange/10">
                                                                Trip in Progress 🚗
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {(activeRide?.status === 'ACCEPTED' || activeRide?.status === 'ARRIVING') && activeRide?.otp && (
                                                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-inner">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Share OTP to start</p>
                                                            <p className="text-[9px] text-gray-400 mt-0.5">Please share this with your captain.</p>
                                                        </div>
                                                        <div className="bg-white border-2 border-emerald-100 px-4 md:px-6 py-1.5 md:py-2 rounded-xl md:rounded-2xl shadow-sm">
                                                            <p className="text-xl md:text-2xl font-black text-emerald-500 tracking-[0.2em]">{activeRide.otp}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                                    <a href={`tel:0000000000`} className="no-underline">
                                                        <Button variant="secondary" fullWidth className="rounded-xl h-12 md:h-14"><Phone className="w-4 h-4 mr-2"/> Call</Button>
                                                    </a>
                                                    <Button variant="secondary" className="rounded-xl h-12 md:h-14 text-blue-500"><Info className="w-4 h-4 mr-2"/> Safety</Button>
                                                </div>

                                                {/* Inline Chat Bar / Entry */}
                                                <div 
                                                    onClick={() => setChatOpen(true)}
                                                    className="group flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:bg-white hover:border-brand-orange/30 hover:shadow-md transition-all"
                                                >
                                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
                                                        <MessageSquare className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors">Type a message...</p>
                                                        <p className="text-[10px] text-gray-400 font-medium">Captain is arriving shortly</p>
                                                    </div>
                                                    <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
                                                </div>
                                            </div>
                                            <div className="p-6 border-t bg-white sticky bottom-0">
                                                <Button 
                                                    variant="ghost" 
                                                    fullWidth 
                                                    onClick={() => setCancelModalOpen(true)} 
                                                    className="text-gray-400 font-bold hover:text-brand-red py-4"
                                                >
                                                    Cancel Ride
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {/* Modal & Chat Overlays */}
            <CancelRideModal 
                isOpen={cancelModalOpen} 
                onClose={() => setCancelModalOpen(false)} 
                onConfirm={handleCancelRide}
                loading={cancelling}
            />

            {activeRide && (
                <ChatModule 
                    isOpen={chatOpen} 
                    onClose={() => setChatOpen(false)} 
                    ride={activeRide} 
                    user={user} 
                />
            )}
        </div>
    );
};
