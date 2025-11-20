"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Spinner from './Spinner';

interface MyAccountModalProps {
    onClose: () => void;
}

export default function MyAccountModal({ onClose }: MyAccountModalProps) {
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'rewards', 'parcels', 'bookings'
    const { customer, logout } = useApp();

    if (!customer) return null;
    
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/75 flex justify-center items-start pt-[5vh] z-[100] overflow-y-auto" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl max-w-[90%] w-[700px] mb-[5vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 flex justify-between items-center border-b">
                    <h2 className="text-2xl font-bold text-slate-900">My Account</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-2xl">&times;</button>
                </div>
                <div className="flex flex-col md:flex-row">
                    {/* Sidebar Navigation */}
                    <div className="w-full md:w-1/3 p-6 border-b md:border-b-0 md:border-r">
                        <div className="text-center mb-4">
                            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                                {customer.name.charAt(0)}
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mt-2">{customer.name}</h3>
                            <p className="text-sm text-slate-500">{customer.email}</p>
                        </div>
                        <nav className="space-y-2">
                            <AccountTabLink tab="profile" activeTab={activeTab} setTab={setActiveTab} label="My Profile" />
                            <AccountTabLink tab="bookings" activeTab={activeTab} setTab={setActiveTab} label="My Bookings" />
                            <AccountTabLink tab="rewards" activeTab={activeTab} setTab={setActiveTab} label="My Rewards" />
                            <AccountTabLink tab="parcels" activeTab={activeTab} setTab={setActiveTab} label="My Parcels" />
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
                            >
                                Logout
                            </button>
                        </nav>
                    </div>
                    
                    {/* Content Area */}
                    <div className="w-full md:w-2/3 p-6 md:p-8">
                        {activeTab === 'profile' && <MyProfileTab />}
                        {activeTab === 'bookings' && <MyBookingsTab />}
                        {activeTab === 'rewards' && <MyRewardsTab />}
                        {activeTab === 'parcels' && <MyParcelsTab />}
                    </div>
                </div>
            </div>
        </div>
    );
}

const AccountTabLink = ({ tab, activeTab, setTab, label }: { tab: string, activeTab: string, setTab: (t: string) => void, label: string }) => (
    <button 
        onClick={() => setTab(tab)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg ${
            activeTab === tab 
            ? 'bg-blue-50 text-blue-700' 
            : 'text-slate-700 hover:bg-slate-50'
        }`}
    >
        {label}
    </button>
);

function MyProfileTab() {
    const { token, customer, showNotification, setCustomer, API_URL } = useApp();
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', surname: '', phone: '', email: '', nextOfKinName: '', nextOfKinContact: '' });

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${API_URL}/customer-auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setProfileData({
                    name: data.name,
                    surname: data.surname || '',
                    phone: data.phone,
                    email: data.email, 
                    nextOfKinName: data.nextOfKinName || '',
                    nextOfKinContact: data.nextOfKinContact || ''
                });
            } catch (err: any) {
                showNotification(err.message, 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCustomerData();
    }, [token, API_URL, showNotification]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        
        const body = {
            name: profileData.name,
            surname: profileData.surname,
            phone: profileData.phone,
            nextOfKinName: profileData.nextOfKinName,
            nextOfKinContact: profileData.nextOfKinContact
        };

        try {
            const res = await fetch(`${API_URL}/customer-auth/me`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            
            if (customer) {
                const updatedCustomer = { ...customer, ...data };
                setCustomer(updatedCustomer);
                localStorage.setItem('customer', JSON.stringify(updatedCustomer));
            }

            showNotification('Profile updated successfully!', 'success');
        } catch (err: any) {
            showNotification(err.message, 'error');
        } finally {
            setIsUpdatingProfile(false);
        }
    };
    
    if (isLoading) return <Spinner />;

    return (
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6">My Profile</h3>
            <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" id="name" value={profileData.name} onChange={handleProfileChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Surname</label>
                        <input type="text" name="surname" id="surname" value={profileData.surname} onChange={handleProfileChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Cannot be changed)</label>
                        <input type="email" name="email" id="email" value={profileData.email} className={inputClasses + " bg-slate-50"} readOnly />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" name="phone" id="phone" value={profileData.phone} onChange={handleProfileChange} className={inputClasses} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label htmlFor="nextOfKinName" className="block text-sm font-medium text-gray-700">Next of Kin Name</label>
                        <input type="text" name="nextOfKinName" id="nextOfKinName" placeholder="e.g., Jane Doe" value={profileData.nextOfKinName} onChange={handleProfileChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="nextOfKinContact" className="block text-sm font-medium text-gray-700">Next of Kin Contact</label>
                        <input type="tel" name="nextOfKinContact" id="nextOfKinContact" placeholder="e.g., 0821234567" value={profileData.nextOfKinContact} onChange={handleProfileChange} className={inputClasses} />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isUpdatingProfile} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                        {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

function MyBookingsTab() {
    const { API_URL, token, showNotification } = useApp();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const formatDepartureDateTime = (booking: any) => {
        const dateTimeString = booking.departureDateTime || (booking.departureDate && booking.departureTime && `${booking.departureDate}T${booking.departureTime}`);
        if (dateTimeString) {
            const parsed = new Date(dateTimeString);
            if (!isNaN(parsed.getTime())) return parsed.toLocaleString();
        }

        if (booking.departureDate) {
            const dateOnly = new Date(booking.departureDate);
            if (!isNaN(dateOnly.getTime())) return dateOnly.toLocaleDateString();
        }

        if (booking.bookingDate) {
            const bookingCreated = new Date(booking.bookingDate);
            if (!isNaN(bookingCreated.getTime())) return `Booked on ${bookingCreated.toLocaleString()}`;
        }

        return 'Schedule not available yet';
    };

    useEffect(() => {
        const headers: any = { 'Authorization': `Bearer ${token}` };
        fetch(`${API_URL}/customer-auth/me/bookings`, { headers })
            .then(res => res.json())
            .then(data => {
                if (data.message) throw new Error(data.message);
                setBookings(data);
            })
            .catch(e => showNotification(e.message, 'error'))
            .finally(() => setLoading(false));
    }, [token, API_URL, showNotification]);

    if (loading) return <Spinner />;

    return (
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6">My Bookings</h3>
            {bookings.length === 0 ? (
                <p className="text-slate-500">You have no booking history.</p>
            ) : (
                <div className="space-y-4">
                    {bookings.map(b => (
                        <div key={b.id} className="bg-white border border-slate-200 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="font-mono font-bold text-blue-600">{b.referenceNumber}</span>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                    b.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                    b.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-slate-100 text-slate-600'
                                }`}>{b.status}</span>
                            </div>
                            <p className="font-bold text-slate-800 mt-2">{b.routeName}</p>
                            <p className="text-sm text-slate-600">{b.fromStop} &rarr; {b.toStop}</p>
                            <div className="text-sm text-slate-500 mt-2 flex justify-between">
                                <span>{formatDepartureDateTime(b)}</span>
                                <span className="font-bold text-slate-700">R {parseFloat(b.totalAmount).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function MyRewardsTab() {
    const { API_URL, token, showNotification } = useApp();
    const [status, setStatus] = useState<any>(null);
    const [rewards, setRewards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const headers: any = { 'Authorization': `Bearer ${token}` };
        Promise.all([
            fetch(`${API_URL}/customer-auth/me/loyalty-status`, { headers }).then(r => r.json()),
            fetch(`${API_URL}/customer-auth/me/rewards`, { headers }).then(r => r.json())
        ]).then(([statusData, rewardsData]) => {
            if (statusData.message) throw new Error('Failed to load loyalty status: ' + statusData.message);
            if (rewardsData.message) throw new Error('Failed to load rewards: ' + rewardsData.message);
            setStatus(statusData);
            setRewards(rewardsData);
        }).catch(e => showNotification(e.message || 'Error loading rewards', 'error'))
        .finally(() => setLoading(false));
    }, [token, API_URL, showNotification]);

    if (loading) return <Spinner />;
    if (!status) return <p className="text-slate-500">Could not load loyalty information.</p>;
    
    const points = status.loyaltyPoints || 0;
    const nextTier = status.nextRewardTier;
    const progressPercent = nextTier ? (points / nextTier.pointsRequired) * 100 : 0;

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Loyalty Status</h3>
                <p className="text-sm text-slate-500 mb-4">You have <span className="font-bold text-blue-600">{points}</span> loyalty points.</p>
                
                {nextTier ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div className="flex justify-between items-center text-sm mb-1">
                            <span className="font-medium text-slate-700">Next Reward: <span className="font-bold">{nextTier.rewardName}</span></span>
                            <span className="font-bold text-slate-600">{points} / {nextTier.pointsRequired}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                ) : (
                        <div className="bg-slate-50 border-dashed border-slate-200 rounded-lg p-4 text-center">
                        <p className="font-medium text-slate-600">You have earned all available rewards!</p>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Your Unredeemed Rewards</h3>
                {rewards.length === 0 ? (
                    <p className="text-slate-500">You haven&apos;t earned any rewards yet. Keep travelling to earn!</p>
                ) : (
                    <ul className="space-y-3">
                        {rewards.map(r => (
                            <li key={r.id} className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{r.rewardName}</p>
                                    <p className="text-sm text-slate-500">{r.rewardDescription || `Earned on ${new Date(r.dateEarned).toLocaleDateString()}`}</p>
                                </div>
                                <span className={`px-3 py-1 text-sm font-bold rounded-full bg-yellow-100 text-yellow-800`}>Available</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function MyParcelsTab() {
    const { API_URL, token, showNotification } = useApp();
    const [parcels, setParcels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const headers: any = { 'Authorization': `Bearer ${token}` };
        fetch(`${API_URL}/customer-auth/me/parcels`, { headers })
            .then(res => res.json())
            .then(data => {
                if (data.message) throw new Error(data.message);
                setParcels(data);
            })
            .catch(e => showNotification(e.message, 'error'))
            .finally(() => setLoading(false));
    }, [token, API_URL, showNotification]);
    
    if (loading) return <Spinner/>;

    return (
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6">My Parcels</h3>
            {parcels.length === 0 ? (
                <p className="text-slate-500">You have not sent or received any parcels with us yet.</p>
            ) : (
                <div className="overflow-x-auto space-y-4">
                    {parcels.map(p => (
                        <div key={p.trackingNumber} className="bg-white border border-slate-200 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                <span className="font-mono font-bold text-blue-600">{p.trackingNumber}</span>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                    p.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                    p.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                                    'bg-slate-100 text-slate-600'
                                }`}>{p.status}</span>
                            </div>
                            <p className="font-bold text-slate-800 mt-2">{p.fromStop} &rarr; {p.toStop}</p>
                            <p className="text-sm text-slate-600">{p.operatorName}</p>
                            <div className="text-sm text-slate-500 mt-2 flex justify-between">
                                <span>Sent: {new Date(p.dateSent).toLocaleDateString()}</span>
                                <span className="font-bold text-slate-700">R {parseFloat(p.cost).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
