import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const LiveRideContext = createContext();

export const LiveRideProvider = ({ children }) => {
    const { user } = useAuth();
    const [activeRide, setActiveRide] = useState(null);
    const [nearbyRides, setNearbyRides] = useState([]);
    const [isOnline, setIsOnline] = useState(false);
    const [driverProfile, setDriverProfile] = useState(null);
    const [location, setLocation] = useState({ lat: 30.7333, lng: 76.7794 });
    
    // Use a ref for the timeout to avoid stale closure issues
    const pollRef = useRef(null);

    // ── Init driver profile (for driver role users only) ──────────────────────
    useEffect(() => {
        if (!user) {
            setActiveRide(null);
            setNearbyRides([]);
            setIsOnline(false);
            setDriverProfile(null);
            return;
        }

        if (user.role === 'driver') {
            const initDriver = async () => {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/drivers/profile/${user.id}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data && data._id) {
                            setDriverProfile(data);
                            setIsOnline(data.isOnline || false);
                            if (data.currentLocation?.lat) setLocation(data.currentLocation);
                        }
                    }
                } catch (e) {}
            };
            initDriver();
        }
    }, [user]);

    // Keep refs so the polling closure always reads the latest values  
    const isOnlineRef = useRef(isOnline);
    const activeRideRef = useRef(activeRide);
    
    useEffect(() => { isOnlineRef.current = isOnline; }, [isOnline]);
    useEffect(() => { activeRideRef.current = activeRide; }, [activeRide]);

    // ── Global polling loop ───────────────────────────────────────────────────
    useEffect(() => {
        if (!user) return;
        if (pollRef.current) clearTimeout(pollRef.current);

        const isDriver = user.role === 'driver';

        const pollData = async () => {
            try {
                const role = isDriver ? 'driver' : 'user';
                let activeData = null;

                if (activeRideRef.current?._id) {
                    const statusRes = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/rides/${activeRideRef.current._id}`);
                    if (statusRes.ok) {
                        activeData = await statusRes.json();
                    }
                } else {
                    const actRes = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/rides/active?userId=${user.id}&role=${role}`);
                    if (actRes.ok) {
                        activeData = await actRes.json();
                    }
                }

                if (activeData && activeData._id) {
                    setActiveRide(prev => {
                        if (!prev || prev._id !== activeData._id || prev.status !== activeData.status) {
                            return activeData;
                        }
                        return prev;
                    });
                    // Only clear nearby rides if the ride is still ongoing
                    if (!['CANCELLED', 'COMPLETED'].includes(activeData.status)) {
                        setNearbyRides([]);
                    }
                } else {
                    setActiveRide(prev => prev ? null : prev);
                }

                // Driver-only: fetch nearby pending rides when online & no active ride
                if (isDriver && isOnlineRef.current) {
                    // We check global activeRide state via the setter's functional form
                    setActiveRide(prev => {
                        if (!prev) {
                            // No active ride → fetch nearby
                            fetch((import.meta.env.VITE_API_URL || "") + '/api/rides/nearby').then(r => r.ok ? r.json() : []).then(data => {
                                setNearbyRides(d => JSON.stringify(d) !== JSON.stringify(data) ? data : d);
                            });
                        }
                        return prev; // Don't change activeRide
                    });
                }
            } catch (err) {
                console.error('Live polling error:', err);
            }
            pollRef.current = setTimeout(pollData, 4000);
        };

        pollData();
        return () => { if (pollRef.current) clearTimeout(pollRef.current); };
    }, [user]);

    // ── Update ride status (driver actions: ARRIVING, IN_PROGRESS, COMPLETED) ─
    const updateRideStatus = async (rideId, newStatus, otpInput = null) => {
        try {
            const bodyPayload = { rideId, status: newStatus };
            if (otpInput) bodyPayload.otp = otpInput;

            const res = await fetch((import.meta.env.VITE_API_URL || "") + '/api/rides/status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyPayload)
            });

            if (res.ok) {
                const updatedRide = await res.json();
                if (newStatus === 'COMPLETED' || newStatus === 'CANCELLED') {
                    setActiveRide(null);
                } else {
                    setActiveRide(updatedRide);
                }
                return { success: true, ride: updatedRide };
            } else {
                const errorData = await res.json();
                return { success: false, error: errorData.error };
            }
        } catch (err) {
            return { success: false, error: 'Network error' };
        }
    };

    // ── Accept a ride request (driver) ────────────────────────────────────────
    const acceptRideRequest = async (ride) => {
        try {
            const res = await fetch((import.meta.env.VITE_API_URL || "") + '/api/rides/accept', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rideId: ride._id, driverId: user.id })
            });
            if (res.ok) {
                const updatedRide = await res.json();
                setActiveRide(updatedRide);
                setNearbyRides([]);
                return true;
            }
        } catch (err) {
            console.error('Accept ride error:', err);
        }
        return false;
    };

    // ── Cancel a ride (user or driver) ────────────────────────────────────────
    const cancelRideRequest = async (rideId, reason) => {
        try {
            const res = await fetch((import.meta.env.VITE_API_URL || "") + '/api/rides/cancel', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rideId, cancelReason: reason })
            });
            if (res.ok) {
                setActiveRide(null);
                setNearbyRides([]);
                return true;
            }
        } catch (err) {
            console.error('Cancel ride error:', err);
        }
        return false;
    };

    // ── Toggle driver online/offline ──────────────────────────────────────────
    const toggleOnlineStatus = async () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus);
        if (driverProfile) {
            try {
                await fetch((import.meta.env.VITE_API_URL || "") + '/api/drivers/status', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, isOnline: newStatus, location })
                });
            } catch (e) {}
        }
    };

    return (
        <LiveRideContext.Provider value={{
            activeRide, setActiveRide,
            nearbyRides, setNearbyRides,
            isOnline, setIsOnline, toggleOnlineStatus,
            driverProfile, setDriverProfile,
            location, setLocation,
            updateRideStatus,
            acceptRideRequest,
            cancelRideRequest
        }}>
            {children}
        </LiveRideContext.Provider>
    );
};

export const useLiveRide = () => useContext(LiveRideContext);
