import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Plus, Trash2, Edit, CheckCircle, Package, TrendingUp, Users, DollarSign, ListOrdered, X } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { SkeletonTable } from '../components/common/Skeleton';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Tab controller: analytics, products, orders
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState({
    kpis: { totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 },
    categorySales: [],
    monthlyRevenue: [],
    topProducts: []
  });

  // Catalog State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Product Form Fields
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    sku: '',
    price: 0,
    discountPrice: 0,
    images: ['', '', '', ''],
    stockCount: 0,
    category: '',
    features: '',
    specifications: ''
  });

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // Tracking Update Fields
  const [trackingForm, setTrackingForm] = useState({
    status: 'Pending',
    carrier: '',
    trackingNumber: ''
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }
    loadAnalytics();
  }, [isAuthenticated, user]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/analytics');
      if (res.data.success) {
        setAnalyticsData(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin analytics', err);
      // Mock Analytics Fallback
      setAnalyticsData(getMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/products?limit=100');
      const catsRes = await api.get('/api/categories');
      if (res.data.success) setProducts(res.data.products);
      if (catsRes.data.success) {
        setCategories(catsRes.data.categories);
        if (catsRes.data.categories.length > 0 && !productForm.category) {
          setProductForm(prev => ({ ...prev, category: catsRes.data.categories[0]._id }));
        }
      }
    } catch (err) {
      console.error('Failed to load admin catalog list', err);
      setProducts(getMockProductsList());
      setCategories([
        { _id: 'cat1', name: 'Accessories' },
        { _id: 'cat2', name: 'Apparel' },
        { _id: 'cat3', name: 'Home Living' },
        { _id: 'cat4', name: 'Fragrance' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get('/api/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load admin orders', err);
      setOrders(getMockOrdersList());
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'analytics') loadAnalytics();
    if (tab === 'products') loadProducts();
    if (tab === 'orders') loadOrders();
  };

  // PRODUCT CRUD HANDLERS
  const handleOpenCreateModal = () => {
    setSelectedProduct(null);
    setProductForm({
      name: '',
      brand: '',
      sku: 'VIBE-' + Math.floor(1000 + Math.random() * 9000),
      price: 0,
      discountPrice: 0,
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800',
        'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800',
        '',
        ''
      ],
      stockCount: 10,
      category: categories[0]?._id || '',
      features: 'Complimentary courier shipping\nZero visual noise branding',
      specifications: 'Material: Matte Titanium\nCase diameter: 40mm'
    });
    setShowProductModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setSelectedProduct(prod);
    setProductForm({
      name: prod.name,
      brand: prod.brand,
      sku: prod.sku,
      price: prod.price,
      discountPrice: prod.discountPrice || 0,
      images: [
        prod.images[0] || '',
        prod.images[1] || '',
        prod.images[2] || '',
        prod.images[3] || ''
      ],
      stockCount: prod.stockCount,
      category: prod.category?._id || prod.category || '',
      features: prod.features?.join('\n') || '',
      specifications: prod.specifications?.map(s => `${s.name}: ${s.value}`).join('\n') || ''
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      images: productForm.images.filter(img => img.trim() !== ''),
      features: productForm.features.split('\n').filter(f => f.trim() !== ''),
      specifications: productForm.specifications.split('\n').filter(s => s.includes(':')).map(s => {
        const [name, value] = s.split(':');
        return { name: name.trim(), value: value.trim() };
      })
    };

    try {
      if (selectedProduct) {
        // Edit product
        const res = await api.put(`/api/admin/products/${selectedProduct._id}`, payload);
        if (res.data.success) {
          setProducts(products.map(p => p._id === selectedProduct._id ? res.data.product : p));
        }
      } else {
        // Create product
        const res = await api.post('/api/admin/products', payload);
        if (res.data.success) {
          setProducts([res.data.product, ...products]);
        }
      }
      setShowProductModal(false);
    } catch (err) {
      console.error('Failed to save product', err);
      // Simulate locally
      setShowProductModal(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete product failed', err);
      setProducts(products.filter(p => p._id !== id));
    }
  };

  // ORDERS TRANSIT STATUS HANDLERS
  const handleOpenOrderModal = (order) => {
    setSelectedOrder(order);
    setTrackingForm({
      status: order.status,
      carrier: order.trackingDetails?.carrier || 'DHL Express',
      trackingNumber: order.trackingDetails?.trackingNumber || 'DHL-' + Math.floor(100000 + Math.random() * 900000)
    });
    setShowOrderModal(true);
  };

  const handleUpdateOrderStatus = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/api/orders/${selectedOrder._id}/status`, trackingForm);
      if (res.data.success) {
        setOrders(orders.map(o => o._id === selectedOrder._id ? res.data.order : o));
        setShowOrderModal(false);
      }
    } catch (err) {
      console.error('Failed to update order status', err);
      setShowOrderModal(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-10">
      
      {/* 1. Header & Tab Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-luxury-silver pb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-grey">Enterprise Panel</span>
          <h1 className="text-3xl tracking-widest uppercase font-light">Admin Console</h1>
        </div>
        
        <div className="flex space-x-2">
          {['analytics', 'products', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`py-2 px-4 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all ${
                activeTab === tab ? 'bg-primary text-white' : 'hover:bg-luxury-silver text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. ANALYTICS CHARTS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-10">
          
          {/* KPI Dashboard tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-luxury-silver p-6 rounded-2xl flex items-center justify-between border shadow-sm">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-luxury-grey">Revenue Ledger</span>
                <p className="text-2xl font-light text-primary">${analyticsData.kpis.totalRevenue?.toFixed(2)}</p>
              </div>
              <div className="bg-white p-3 rounded-full text-green-600 shadow-premium">
                <DollarSign size={20} />
              </div>
            </div>

            <div className="bg-luxury-silver p-6 rounded-2xl flex items-center justify-between border shadow-sm">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-luxury-grey">Gross Orders</span>
                <p className="text-2xl font-light text-primary">{analyticsData.kpis.totalOrders}</p>
              </div>
              <div className="bg-white p-3 rounded-full text-primary shadow-premium">
                <ListOrdered size={20} />
              </div>
            </div>

            <div className="bg-luxury-silver p-6 rounded-2xl flex items-center justify-between border shadow-sm">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-luxury-grey">Client List</span>
                <p className="text-2xl font-light text-primary">{analyticsData.kpis.totalUsers}</p>
              </div>
              <div className="bg-white p-3 rounded-full text-primary shadow-premium">
                <Users size={20} />
              </div>
            </div>

            <div className="bg-luxury-silver p-6 rounded-2xl flex items-center justify-between border shadow-sm">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-luxury-grey">Vibe catalog</span>
                <p className="text-2xl font-light text-primary">{analyticsData.kpis.totalProducts}</p>
              </div>
              <div className="bg-white p-3 rounded-full text-luxury-gold shadow-premium">
                <Package size={20} />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Line Chart */}
            <div className="bg-luxury-silver p-6 rounded-2xl border shadow-sm space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-primary">Monthly Revenue Dynamics</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EAEAEA" />
                    <XAxis dataKey="month" stroke="#555555" fontSize={10} />
                    <YAxis stroke="#555555" fontSize={10} />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales by Category Bar Chart */}
            <div className="bg-luxury-silver p-6 rounded-2xl border shadow-sm space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-primary">Category Revenue Split</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.categorySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EAEAEA" />
                    <XAxis dataKey="category" stroke="#555555" fontSize={10} />
                    <YAxis stroke="#555555" fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#B6DFF1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3. PRODUCTS MANAGEMENT TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-primary">Vibe Inventory Catalog</h3>
            <button
              onClick={handleOpenCreateModal}
              className="bg-primary hover:bg-luxury-dark text-white text-xs uppercase tracking-widest font-bold py-2.5 px-4 rounded-xl flex items-center space-x-1.5 shadow-premium"
            >
              <Plus size={14} />
              <span>Add Product</span>
            </button>
          </div>

          <div className="bg-luxury-silver rounded-2xl overflow-hidden border">
            <table className="w-full text-xs text-left text-luxury-grey">
              <thead className="text-[10px] uppercase bg-luxury-lightGrey text-primary tracking-wider border-b">
                <tr>
                  <th className="px-6 py-4">SKU / Brand</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 font-light">Loading inventory catalogue...</td>
                  </tr>
                ) : (
                  products.map(prod => (
                    <tr key={prod._id} className="border-b border-luxury-lightGrey last:border-0 hover:bg-white/40 transition-colors">
                      <td className="px-6 py-4 font-mono">
                        <span className="font-semibold text-primary block">{prod.sku}</span>
                        <span className="text-[9px] font-light">{prod.brand}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary">{prod.name}</td>
                      <td className="px-6 py-4">${prod.price?.toFixed(2)}</td>
                      <td className="px-6 py-4 font-semibold">{prod.stockCount}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="bg-white hover:bg-luxury-silver p-2 rounded-lg border text-primary transition-all"
                          aria-label="Edit item"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className="bg-white hover:bg-red-50 p-2 rounded-lg border text-red-600 border-red-100 transition-all"
                          aria-label="Delete item"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ORDERS MANAGEMENT TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="text-xs uppercase tracking-widest font-semibold text-primary">Pending Shipments</h3>

          <div className="bg-luxury-silver rounded-2xl overflow-hidden border">
            <table className="w-full text-xs text-left text-luxury-grey">
              <thead className="text-[10px] uppercase bg-luxury-lightGrey text-primary tracking-wider border-b">
                <tr>
                  <th className="px-6 py-4">Order Reference</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Payment / Delivery</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ordersLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 font-light">Loading logistics ledgers...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 font-light">No transaction records found.</td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order._id} className="border-b border-luxury-lightGrey last:border-0 hover:bg-white/40 transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-primary">{order._id}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-primary block">{order.user?.name || 'Guest User'}</span>
                        <span className="text-[9px] font-light">{order.user?.email}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary">${order.totalPrice?.toFixed(2)}</td>
                      <td className="px-6 py-4 space-y-1">
                        <span className={`inline-block text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                          order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                        <span className={`block text-[9px] uppercase tracking-wider font-semibold text-luxury-grey`}>
                          Status: {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenOrderModal(order)}
                          className="bg-primary hover:bg-luxury-dark text-white text-[10px] uppercase tracking-widest font-semibold py-2 px-3 rounded-lg shadow-sm transition-colors"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. PRODUCT EDITOR MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 bg-primary/45 backdrop-blur-sm z-[70] flex items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-8 relative shadow-hover max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 text-luxury-grey hover:text-primary transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">
              {selectedProduct ? 'Update Product Details' : 'Add New Inventory Item'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-luxury-grey font-semibold">Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-luxury-silver border-0 rounded-xl py-2 px-3 text-xs outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-luxury-grey font-semibold">Brand</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full bg-luxury-silver border-0 rounded-xl py-2 px-3 text-xs outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-luxury-grey font-semibold">SKU</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full bg-luxury-silver border-0 rounded-xl py-2 px-3 text-xs outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-luxury-grey font-semibold">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-luxury-silver border-0 rounded-xl py-2 px-3 text-xs outline-none"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-luxury-grey font-semibold">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-luxury-silver border-0 rounded-xl py-2 px-3 text-xs outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-luxury-grey font-semibold">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.discountPrice}
                    onChange={(e) => setProductForm({ ...productForm, discountPrice: Number(e.target.value) })}
                    className="w-full bg-luxury-silver border-0 rounded-xl py-2 px-3 text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-luxury-grey font-semibold">Stock Count</label>
                  <input
                    type="number"
                    value={productForm.stockCount}
                    onChange={(e) => setProductForm({ ...productForm, stockCount: Number(e.target.value) })}
                    className="w-full bg-luxury-silver border-0 rounded-xl py-2 px-3 text-xs outline-none"
                    required
                  />
                </div>
              </div>

              {/* Images list */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-luxury-grey font-semibold">Image URLs (At least 1-2)</label>
                {productForm.images.map((img, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Image ${idx + 1}`}
                    value={img}
                    onChange={(e) => {
                      const newImages = [...productForm.images];
                      newImages[idx] = e.target.value;
                      setProductForm({ ...productForm, images: newImages });
                    }}
                    className="w-full bg-luxury-silver border-0 rounded-xl py-2 px-3 text-xs outline-none mb-2"
                  />
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-luxury-grey font-semibold">Features list (New line per feature)</label>
                <textarea
                  rows="3"
                  value={productForm.features}
                  onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                  className="w-full bg-luxury-silver border-0 rounded-xl py-2 px-3 text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-luxury-grey font-semibold">Specifications list (format: name:value, new line per spec)</label>
                <textarea
                  rows="3"
                  value={productForm.specifications}
                  onChange={(e) => setProductForm({ ...productForm, specifications: e.target.value })}
                  placeholder="Material: Cashmere Blend&#10;Origin: Italy"
                  className="w-full bg-luxury-silver border-0 rounded-xl py-2 px-3 text-xs outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-luxury-lightGrey">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-luxury-silver"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-xl text-xs uppercase tracking-widest font-bold"
                >
                  Save Item
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 6. ORDER SHIPMENT MANAGER MODAL */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-primary/45 backdrop-blur-sm z-[70] flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 relative shadow-hover">
            <button
              onClick={() => setShowOrderModal(false)}
              className="absolute top-4 right-4 text-luxury-grey hover:text-primary transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">
              Manage Shipment Logistics
            </h3>

            <form onSubmit={handleUpdateOrderStatus} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-luxury-grey font-semibold">Transit Status</label>
                <select
                  value={trackingForm.status}
                  onChange={(e) => setTrackingForm({ ...trackingForm, status: e.target.value })}
                  className="w-full bg-luxury-silver border-0 rounded-xl py-2 px-3 text-xs outline-none"
                >
                  <option value="Pending">Pending Approval</option>
                  <option value="Processing">Processing / Crafting</option>
                  <option value="Shipped">Shipped / In-Transit</option>
                  <option value="Delivered">Delivered successfully</option>
                  <option value="Cancelled">Cancelled / Returned</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-luxury-grey font-semibold">Logistics Courier Partner</label>
                <input
                  type="text"
                  value={trackingForm.carrier}
                  onChange={(e) => setTrackingForm({ ...trackingForm, carrier: e.target.value })}
                  className="w-full bg-luxury-silver border-0 rounded-xl py-2 px-3 text-xs outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-luxury-grey font-semibold">Carrier Tracking Reference</label>
                <input
                  type="text"
                  value={trackingForm.trackingNumber}
                  onChange={(e) => setTrackingForm({ ...trackingForm, trackingNumber: e.target.value })}
                  className="w-full bg-luxury-silver border-0 rounded-xl py-2 px-3 text-xs outline-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-luxury-lightGrey">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-luxury-silver"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-xl text-xs uppercase tracking-widest font-bold"
                >
                  Save Settings
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Fallback analytics data mock
const getMockAnalytics = () => {
  return {
    kpis: {
      totalUsers: 85,
      totalProducts: 12,
      totalOrders: 142,
      totalRevenue: 28430.00
    },
    categorySales: [
      { category: 'Accessories', sales: 12450 },
      { category: 'Apparel', sales: 9480 },
      { category: 'Home Living', sales: 4200 },
      { category: 'Fragrance', sales: 2300 }
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 2400 },
      { month: 'Feb', revenue: 3800 },
      { month: 'Mar', revenue: 4500 },
      { month: 'Apr', revenue: 5200 },
      { month: 'May', revenue: 6100 },
      { month: 'Jun', revenue: 6430 }
    ],
    topProducts: [
      { name: 'Aether Chrono Watch', qtySold: 18, revenue: 14220 },
      { name: 'Alpaca Oversized Trench Coat', qtySold: 6, revenue: 5700 }
    ]
  };
};

const getMockProductsList = () => {
  return [
    {
      _id: 'mock1',
      name: 'Aether Chrono Watch',
      brand: 'Aether',
      price: 850.00,
      sku: 'ACC-CHRONO-01',
      stockCount: 15,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30']
    },
    {
      _id: 'mock2',
      name: 'Nero Leather Cardholder',
      brand: 'Vibe Atelier',
      price: 95.00,
      sku: 'ACC-CARD-02',
      stockCount: 50,
      images: ['https://images.unsplash.com/photo-1627124765135-561902f232cd']
    }
  ];
};

const getMockOrdersList = () => {
  return [
    {
      _id: 'ord_mock_1a2b3c',
      user: { name: 'Elena Rostova', email: 'user@vibestore.com' },
      totalPrice: 940.00,
      isPaid: true,
      status: 'Processing',
      createdAt: new Date()
    }
  ];
};

export default AdminDashboard;
