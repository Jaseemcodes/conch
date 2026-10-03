import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { X, User, Mail, Phone, Lock, Eye, EyeOff, MapPin, Building, Flame, CheckCircle, AlertCircle } from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    redirectAfterAuth
  } = useAuth();

  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    loginIdentifier: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    customerType: 'domestic', // domestic | commercial | industrial
    companyName: '',
    address: '',
    city: 'Kampala'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginData.loginIdentifier.trim() || !loginData.password) {
      setErrorMsg('Please enter your email/phone and password');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/login', {
        loginIdentifier: loginData.loginIdentifier.trim(),
        password: loginData.password
      });

      if (res.data && res.data.success) {
        login(res.data.token, res.data.user);
        setSuccessMsg('Logged in successfully!');
        
        setTimeout(() => {
          closeAuthModal();
          if (redirectAfterAuth) {
            navigate(redirectAfterAuth);
          } else if (res.data.user.role === 'admin' || res.data.user.role === 'superadmin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/my-account');
          }
        }, 500);
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!registerData.name.trim() || !registerData.email.trim() || !registerData.password) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    if (registerData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/customer/register', {
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        phone: registerData.phone.trim(),
        password: registerData.password,
        customerType: registerData.customerType,
        companyName: registerData.companyName.trim(),
        address: registerData.address.trim(),
        city: registerData.city.trim()
      });

      if (res.data && res.data.success) {
        login(res.data.token, res.data.user);
        setSuccessMsg('Account created successfully! Welcome to Conch Gas.');
        
        setTimeout(() => {
          closeAuthModal();
          if (redirectAfterAuth) {
            navigate(redirectAfterAuth);
          } else {
            navigate('/my-account');
          }
        }, 600);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMsg(err.response?.data?.message || 'Registration failed. Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-xs">
              <Flame className="w-5 h-5 fill-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-wide text-white">
                {authModalMode === 'login' ? 'Customer Login' : 'Create Customer Account'}
              </h3>
              <p className="text-xs text-slate-400">Conch Gas Online Gas Booking Portal</p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              authModalMode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              authModalMode === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New Customer
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authModalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address or Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter email or +256 phone number"
                    value={loginData.loginIdentifier}
                    onChange={(e) => setLoginData({ ...loginData, loginIdentifier: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Sign In to Conch Gas'
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('register')}
                    className="font-bold text-red-600 hover:underline"
                  >
                    Create Free Account
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 font-sans">
              {/* Customer Type Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Account Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'domestic', label: 'Domestic / Home' },
                    { id: 'commercial', label: 'Restaurant / Hotel' },
                    { id: 'industrial', label: 'Industrial / Factory' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setRegisterData({ ...registerData, customerType: t.id })}
                      className={`py-2 px-1 text-[10.5px] font-bold rounded-lg border text-center transition-all ${
                        registerData.customerType === t.id
                          ? 'bg-red-50 border-red-500 text-red-700 font-extrabold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name / Contact Person <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Company Name (for commercial/industrial) */}
              {registerData.customerType !== 'domestic' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Business / Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Building size={15} />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grand View Hotel"
                      value={registerData.companyName}
                      onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 transition-all outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail size={15} />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number (Delivery) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone size={15} />
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="+256 700 000000"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address & City */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Default Delivery Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <MapPin size={15} />
                    </div>
                    <input
                      type="text"
                      placeholder="Street, Plot No, Landmark"
                      value={registerData.address}
                      onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Area / City
                  </label>
                  <select
                    value={registerData.city}
                    onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-red-500 focus:bg-white rounded-xl text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="Kampala">Kampala</option>
                    <option value="Kira Road">Kira Road</option>
                    <option value="Entebbe">Entebbe</option>
                    <option value="Wakiso">Wakiso</option>
                    <option value="Mukono">Mukono</option>
                    <option value="Jinja">Jinja</option>
                  </select>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password (min. 6 chars) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Create password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-red-500 focus:bg-white rounded-xl text-xs font-semibold text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-type password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-red-500 focus:bg-white rounded-xl text-xs font-semibold text-slate-800 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Complete Registration'
                )}
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('login')}
                    className="font-bold text-red-600 hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
