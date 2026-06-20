import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, ShoppingBag, MapPin, Eye, Settings, Plus, Trash2, CheckCircle2, Truck, Package, Clock, ArrowLeft } from 'lucide-react';
import { updateProfile, setAddresses } from '../store/slices/authSlice';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Tab controller
  const activeTab = searchParams.get('tab') || 'profile';

  // Orders and addresses states
  const [orders, setOrders] = useState([]);
  const [addressesList, setAddressesList] = useState(user?.addresses || []);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Address Form States
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: false
  });

  // Tracking details modal state
  const [trackingOrder, setTrackingOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (activeTab === 'orders' || activeTab === 'tracking') {
      fetchOrders();
    }
  }, [activeTab, isAuthenticated]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get('/api/orders/myorders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load user orders', err);
      setOrders(getMockOrders());
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
    setTrackingOrder(null);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      return setProfileMsg({ type: 'error', text: 'Passwords do not match.' });
    }

    try {
      setProfileMsg({ type: '', text: '' });
      const res = await api.put('/api/users/profile', {
        name,
        ...(password ? { password } : {})
      });

      if (res.data.success) {
        dispatch(updateProfile({ name }));
        setProfileMsg({ type: 'success', text: 'Profile details updated.' });
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/users/addresses', newAddress);
      if (res.data.success) {
        dispatch(setAddresses(res.data.addresses));
        setAddressesList(res.data.addresses);
        setShowAddressForm(false);
        setNewAddress({ street: '', city: '', state: '', postalCode: '', country: 'United States', isDefault: false });
      }
    } catch (err) {
      console.error('Failed to add address', err);
      const mockAddresses = [...addressesList, { ...newAddress, _id: 'addr_' + Math.random() }];
      dispatch(setAddresses(mockAddresses));
      setAddressesList(mockAddresses);
      setShowAddressForm(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await api.delete(`/api/users/addresses/${id}`);
      if (res.data.success) {
        dispatch(setAddresses(res.data.addresses));
        setAddressesList(res.data.addresses);
      }
    } catch (err) {
      console.error('Failed to delete address', err);
      const mockAddresses = addressesList.filter(addr => addr._id !== id);
      dispatch(setAddresses(mockAddresses));
      setAddressesList(mockAddresses);
    }
  };

  const handleTrackOrder = (order) => {
    setTrackingOrder(order);
    setSearchParams({ tab: 'tracking' });
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 bg-dark text-white min-h-screen">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Sidebar Tabs Column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-charcoal p-6 rounded-2xl space-y-2 border border-white/5">
            <h3 className="text-xs uppercase tracking-widest text-primary font-bold font-display">User Hub</h3>
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-grey-medium truncate">{user?.email}</p>
          </div>

          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 border-b border-charcoal lg:border-b-0 pb-2 lg:pb-0">
            <button
              onClick={() => handleTabChange('profile')}
              className={`flex items-center space-x-2 py-3.5 px-4 text-xs font-bold uppercase tracking-widest rounded-xl transition-all w-full shrink-0 ${
                activeTab === 'profile' ? 'bg-primary text-white font-display' : 'bg-charcoal/50 border border-white/5 hover:border-primary text-white'
              }`}
            >
              <User size={14} />
              <span>Profile Settings</span>
            </button>
            <button
              onClick={() => handleTabChange('orders')}
              className={`flex items-center space-x-2 py-3.5 px-4 text-xs font-bold uppercase tracking-widest rounded-xl transition-all w-full shrink-0 ${
                activeTab === 'orders' || activeTab === 'tracking' ? 'bg-primary text-white font-display' : 'bg-charcoal/50 border border-white/5 hover:border-primary text-white'
              }`}
            >
              <ShoppingBag size={14} />
              <span>Order Ledger</span>
            </button>
            <button
              onClick={() => handleTabChange('addresses')}
              className={`flex items-center space-x-2 py-3.5 px-4 text-xs font-bold uppercase tracking-widest rounded-xl transition-all w-full shrink-0 ${
                activeTab === 'addresses' ? 'bg-primary text-white font-display' : 'bg-charcoal/50 border border-white/5 hover:border-primary text-white'
              }`}
            >
              <MapPin size={14} />
              <span>Saved Locations</span>
            </button>
          </div>
        </div>

        {/* Dynamic Content Columns */}
        <div className="lg:col-span-9 min-h-[400px]">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold font-display">User Profile</span>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white font-display">Edit Account Settings</h2>
              </div>

              {profileMsg.text && (
                <p className={`text-[10px] uppercase tracking-wider px-4 py-3 rounded-xl border ${
                  profileMsg.type === 'success' ? 'bg-green-950 text-green-300 border-green-900' : 'bg-red-950 text-red-300 border-red-900'
                }`}>
                  {profileMsg.text}
                </p>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">New Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-primary text-white text-xs uppercase tracking-widest font-bold py-3.5 px-8 rounded-xl hover:bg-orange transition-all mt-4 shadow-premium"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold font-display">Invoices</span>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white font-display">Your Order History</h2>
              </div>

              {loadingOrders ? (
                <div className="space-y-4">
                  {[1, 2].map(n => (
                    <div key={n} className="h-24 w-full rounded-2xl bg-charcoal animate-pulse" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <p className="text-xs text-grey-medium font-light py-10 border border-dashed border-charcoal rounded-2xl text-center">
                  You have not placed any orders yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-charcoal p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/5"
                    >
                      <div className="space-y-1 flex-grow">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-semibold text-primary truncate max-w-[120px] sm:max-w-xs">{order._id}</span>
                          <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${
                            order.status === 'Delivered' ? 'bg-lime text-dark font-extrabold' : 'bg-primary/20 text-primary border border-primary/30'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-grey-light font-light mt-1">
                          Date: {new Date(order.createdAt).toLocaleDateString()} &bull; Items: {order.orderItems.length} &bull; Total: <span className="text-orange font-bold">${order.totalPrice.toFixed(2)}</span>
                        </p>
                      </div>

                      <div className="flex space-x-3 shrink-0">
                        <button
                          onClick={() => handleTrackOrder(order)}
                          className="bg-primary hover:bg-orange text-white text-[10px] uppercase tracking-widest font-bold py-2.5 px-4 rounded-xl shadow-premium transition-all"
                        >
                          Track Status
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDER TRACKING SUB-TAB */}
          {activeTab === 'tracking' && trackingOrder && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTabChange('orders')}
                  className="text-grey-medium hover:text-white transition-colors flex items-center space-x-1.5"
                >
                  <ArrowLeft size={16} />
                  <span className="text-xs uppercase tracking-widest font-semibold">Back to History</span>
                </button>
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold font-display">Real-Time Status</span>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white font-display">Track shipment</h2>
                <p className="text-xs text-grey-medium font-light mt-1">Order Ref: <span className="font-mono text-primary font-semibold">{trackingOrder._id}</span></p>
              </div>

              {/* Status Stepper visualization */}
              <div className="bg-charcoal p-8 rounded-3xl space-y-8 border border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
                  
                  {/* Step 1: Pending */}
                  <div className="flex items-center space-x-3 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      getStatusStep(trackingOrder.status) >= 1 ? 'bg-primary text-white animate-pulse' : 'bg-dark text-grey-medium border'
                    }`}>
                      <Clock size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">Placed</h4>
                      <p className="text-[9px] text-grey-medium font-light">Order placed securely.</p>
                    </div>
                  </div>

                  {/* Step 2: Processing */}
                  <div className="flex items-center space-x-3 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      getStatusStep(trackingOrder.status) >= 2 ? 'bg-primary text-white' : 'bg-dark text-grey-medium border'
                    }`}>
                      <Package size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">Assembly</h4>
                      <p className="text-[9px] text-grey-medium font-light">Custom gear packing.</p>
                    </div>
                  </div>

                  {/* Step 3: Shipped */}
                  <div className="flex items-center space-x-3 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      getStatusStep(trackingOrder.status) >= 3 ? 'bg-primary text-white' : 'bg-dark text-grey-medium border'
                    }`}>
                      <Truck size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">Transit</h4>
                      <p className="text-[9px] text-grey-medium font-light">Courier dispatch active.</p>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex items-center space-x-3 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      getStatusStep(trackingOrder.status) >= 4 ? 'bg-primary text-white' : 'bg-dark text-grey-medium border'
                    }`}>
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">Arrived</h4>
                      <p className="text-[9px] text-grey-medium font-light">Arrived at target.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Shipping partner tracking meta data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-charcoal p-6 rounded-2xl space-y-3 border border-white/5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary font-display">Logistics Details</h4>
                  <div className="text-xs text-grey-light font-light space-y-1.5">
                    <p>Shipping Partner: <span className="font-semibold text-white">{trackingOrder.trackingDetails?.carrier || 'DHL Express'}</span></p>
                    <p>Tracking Number: <span className="font-mono text-primary">{trackingOrder.trackingDetails?.trackingNumber || 'DHL-MOCK-VELOCITY-987'}</span></p>
                    <p>Estimated Delivery: <span className="font-semibold text-white">
                      {trackingOrder.trackingDetails?.estimatedDeliveryDate
                        ? new Date(trackingOrder.trackingDetails.estimatedDeliveryDate).toLocaleDateString()
                        : new Date(new Date(trackingOrder.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span></p>
                  </div>
                </div>

                <div className="bg-charcoal p-6 rounded-2xl space-y-3 border border-white/5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary font-display">Delivery Target Address</h4>
                  <div className="text-xs text-grey-light font-light">
                    <p className="text-white font-medium">{trackingOrder.shippingAddress?.street}</p>
                    <p>{trackingOrder.shippingAddress?.city}, {trackingOrder.shippingAddress?.state} {trackingOrder.shippingAddress?.postalCode}</p>
                    <p>{trackingOrder.shippingAddress?.country}</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold font-display">Locations</span>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white font-display">Manage Addresses</h2>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="bg-primary hover:bg-orange text-white text-xs uppercase tracking-widest font-bold py-2.5 px-4 rounded-xl flex items-center space-x-1.5 shadow-premium"
                >
                  <Plus size={14} />
                  <span>Add New</span>
                </button>
              </div>

              {/* Form to add address */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="space-y-4 bg-charcoal p-6 rounded-2xl max-w-md animate-in slide-in-from-top duration-300 border border-white/5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary font-display">Address Form</h3>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">Street Address</label>
                    <input
                      type="text"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full bg-dark border border-white/10 rounded-xl py-2 px-3 text-xs outline-none text-white focus:border-primary"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">City</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full bg-dark border border-white/10 rounded-xl py-2 px-3 text-xs outline-none text-white focus:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">State</label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full bg-dark border border-white/10 rounded-xl py-2 px-3 text-xs outline-none text-white focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">Postal Code</label>
                      <input
                        type="text"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                        className="w-full bg-dark border border-white/10 rounded-xl py-2 px-3 text-xs outline-none text-white focus:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">Country</label>
                      <input
                        type="text"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                        className="w-full bg-dark border border-white/10 rounded-xl py-2 px-3 text-xs outline-none text-white focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 border border-white/10 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-dark"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-primary text-white px-4 py-2 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-orange"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}

              {/* Addresses List Grid */}
              {addressesList.length === 0 ? (
                <p className="text-xs text-grey-medium font-light py-10 border border-dashed border-charcoal rounded-2xl text-center">
                  No saved addresses found.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addressesList.map((addr) => (
                    <div
                      key={addr._id}
                      className="bg-charcoal p-6 rounded-2xl relative flex flex-col justify-between h-40 border border-white/5 shadow-sm"
                    >
                      <div className="text-xs text-grey-light font-light space-y-1">
                        {addr.isDefault && (
                          <span className="text-[8px] uppercase tracking-widest font-bold text-lime mb-1 block">Default Address</span>
                        )}
                        <p className="text-white font-semibold">{addr.street}</p>
                        <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                        <p>{addr.country}</p>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-grey-medium hover:text-red transition-colors flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

// Mock Orders helper updated with sportswear product info
const getMockOrders = () => {
  return [
    {
      _id: 'ord_mock_1a2b3c',
      status: 'Processing',
      totalPrice: 340.00,
      createdAt: new Date(),
      orderItems: [
        { name: 'VelocityX ZoomFly V1', qty: 1, price: 220.00, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop' },
        { name: 'AeroVelocity Windrunner Jacket', qty: 1, price: 120.00, image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=800&auto=format&fit=crop' }
      ],
      shippingAddress: {
        street: '45 Speed Way, Penthouse C',
        city: 'Boston',
        state: 'MA',
        postalCode: '02108',
        country: 'United States'
      }
    }
  ];
};

export default Dashboard;
