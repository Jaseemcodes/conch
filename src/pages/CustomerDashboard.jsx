import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import {
  User,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  Flame,
  Plus,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  AlertCircle,
  Calendar,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user, isLoggedIn, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'profile'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    companyName: user?.companyName || '',
    address: user?.address || '',
    city: user?.city || 'Kampala',
    customerType: user?.customerType || 'domestic'
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Address modal state
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    street: '',
    area: '',
    city: 'Kampala',
    landmark: ''
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    // Fetch customer bookings
    const fetchCustomerOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await api.get('/auth/customer/orders');
        if (res.data && res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching customer orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchCustomerOrders();
  }, [isLoggedIn, navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });
    setSavingProfile(true);

    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data && res.data.success) {
        updateUser(res.data.data);
        setStatusMessage({ type: 'success', text: 'Profile information updated successfully!' });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.street.trim()) return;

    const existingAddresses = user?.savedAddresses || [];
    const updatedAddresses = [...existingAddresses, { ...newAddress, isDefault: existingAddresses.length === 0 }];

    try {
      const res = await api.put('/auth/profile', { savedAddresses: updatedAddresses });
      if (res.data && res.data.success) {
        updateUser(res.data.data);
        setIsAddAddressOpen(false);
        setNewAddress({ label: 'Home', street: '', area: '', city: 'Kampala', landmark: '' });
        setStatusMessage({ type: 'success', text: 'New delivery address added successfully!' });
      }
    } catch (err) {
      console.error('Error adding address:', err);
      setStatusMessage({ type: 'error', text: 'Failed to add address' });
    }
  };

  const handleDeleteAddress = async (indexToDelete) => {
    const existingAddresses = user?.savedAddresses || [];
    const updated = existingAddresses.filter((_, idx) => idx !== indexToDelete);

    try {
      const res = await api.put('/auth/profile', { savedAddresses: updated });
      if (res.data && res.data.success) {
        updateUser(res.data.data);
        setStatusMessage({ type: 'success', text: 'Address removed.' });
      }
    } catch (err) {
      console.error('Error removing address:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800"><CheckCircle size={13} /> Delivered</span>;
      case 'dispatched':
      case 'in_transit':
      case 'out_for_delivery':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 animate-pulse"><Truck size={13} /> Out for Delivery</span>;
      case 'booking_confirmed':
      case 'pickup_scheduled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800"><Clock size={13} /> Order Confirmed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">Processing</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* 1. Profile Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-700/60">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 font-black text-2xl shadow-inner">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">{user?.name || 'Customer'}</h1>
                  <span className="px-2 py-0.5 rounded-md text-[10.5px] font-extrabold uppercase tracking-wider bg-red-600 text-white shadow-xs">
                    {user?.customerType === 'commercial' ? 'Commercial Account' : user?.customerType === 'industrial' ? 'Industrial Account' : 'Domestic Account'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1"><Mail size={13} className="text-red-400" /> {user?.email}</span>
                  {user?.phone && <span className="flex items-center gap-1"><Phone size={13} className="text-red-400" /> {user?.phone}</span>}
                  <span className="flex items-center gap-1"><MapPin size={13} className="text-red-400" /> {user?.city || 'Kampala, Uganda'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/calculator.htm"
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Flame size={15} /> Book Gas Refill
              </Link>
              <button
                onClick={logout}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-xs">
          {[
            { id: 'orders', label: 'My Gas Bookings', icon: Package, count: orders.length },
            { id: 'addresses', label: 'Delivery Addresses', icon: MapPin, count: user?.savedAddresses?.length || 0 },
            { id: 'profile', label: 'Account Profile', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setStatusMessage({ type: '', text: '' });
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-extrabold ${
                    activeTab === tab.id ? 'bg-white text-red-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Status Alerts */}
        {statusMessage.text && (
          <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* 3. TAB CONTENT */}

        {/* TAB 1: ORDERS / GAS BOOKINGS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-xs">
                <RefreshCw size={24} className="animate-spin mx-auto text-red-600 mb-3" />
                <p className="text-xs font-bold text-slate-500">Loading your cylinder booking history...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-xs border border-slate-100">
                <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                  <Flame size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">No Active Gas Bookings Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  You haven't placed any LPG or Industrial Gas orders yet. Use our calculator to calculate instant delivery charges.
                </p>
                <Link
                  to="/calculator.htm"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                >
                  <Flame size={15} /> Book Your First Cylinder
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 tracking-wider">
                            Ref: #{order.bookingRef || order._id.slice(-6).toUpperCase()}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                          <Calendar size={12} /> Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-400 font-bold block">Total Amount</span>
                        <span className="text-base font-black text-slate-900">
                          {order.finalPrice ? `UGX ${order.finalPrice.toLocaleString()}` : 'Price on Confirmation'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 font-bold uppercase text-[10px] block">Cylinder & Service</span>
                        <p className="font-extrabold text-slate-800 mt-0.5">
                          {order.medicineType ? `${order.medicineType.toUpperCase()} Gas` : 'LPG Gas'} ({order.weight ? `${order.weight} kg` : 'Standard Cylinder'})
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 font-bold uppercase text-[10px] block">Delivery Location</span>
                        <p className="font-semibold text-slate-700 truncate mt-0.5">
                          {order.destinationAddress || `${order.originCity || 'Kampala'}, Uganda`}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 font-bold uppercase text-[10px] block">Courier / Vehicle</span>
                        <p className="font-semibold text-slate-700 mt-0.5">
                          {order.courierPartner || 'Conch Gas Direct Express'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED DELIVERY ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Your Delivery Addresses</h2>
                <p className="text-xs text-slate-500">Manage doorstep delivery locations for quick 1-click cylinder booking.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(true)}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Plus size={15} /> Add New Address
              </button>
            </div>

            {/* Address List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(user?.savedAddresses || []).length === 0 ? (
                <div className="col-span-full py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <MapPin size={28} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-slate-600">No saved addresses yet.</p>
                  <p className="text-[11px] text-slate-400">Add your home or restaurant address for faster ordering.</p>
                </div>
              ) : (
                user?.savedAddresses.map((addr, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-md bg-slate-200 text-slate-800">
                          {addr.label || 'Home'}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-800 mt-1">{addr.street}</p>
                      <p className="text-xs text-slate-500">{addr.area}, {addr.city}</p>
                      {addr.landmark && <p className="text-[11px] text-slate-400">Landmark: {addr.landmark}</p>}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(idx)}
                      className="text-slate-400 hover:text-red-600 text-xs font-bold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Modal for adding address */}
            {isAddAddressOpen && (
              <div className="p-5 rounded-2xl bg-red-50/50 border border-red-200 animate-in fade-in duration-200">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">Add New Delivery Location</h3>
                <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">Address Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Home, Main Kitchen, Warehouse"
                      value={newAddress.label}
                      onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">City / Town</label>
                    <select
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    >
                      <option value="Kampala">Kampala</option>
                      <option value="Kira Road">Kira Road</option>
                      <option value="Entebbe">Entebbe</option>
                      <option value="Wakiso">Wakiso</option>
                      <option value="Mukono">Mukono</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">Street Address / Plot No. *</label>
                    <input
                      type="text"
                      required
                      placeholder="Plot No, Street, Building Name"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>

                  <div className="flex gap-2 sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddAddressOpen(false)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ACCOUNT PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100">
            <h2 className="text-base font-bold text-slate-900 mb-1">Account & Delivery Information</h2>
            <p className="text-xs text-slate-500 mb-6">Update your contact information and primary gas delivery preferences.</p>

            <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-2xl font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number (SMS & Delivery Alerts)
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address (Login ID)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profileData.email}
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Account Category
                  </label>
                  <select
                    value={profileData.customerType}
                    onChange={(e) => setProfileData({ ...profileData, customerType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-red-500"
                  >
                    <option value="domestic">Domestic LPG (Home Kitchen)</option>
                    <option value="commercial">Commercial LPG (Restaurant / Hotel)</option>
                    <option value="industrial">Industrial Gas (Factory / Workshop)</option>
                  </select>
                </div>
              </div>

              {profileData.customerType !== 'domestic' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company / Establishment Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Grand View Hotel Kampala"
                    value={profileData.companyName}
                    onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Delivery Address
                </label>
                <input
                  type="text"
                  placeholder="Plot No, Street, Kira Road"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {savingProfile ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Save Profile Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
