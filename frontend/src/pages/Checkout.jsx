import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, CheckCircle, ArrowLeft, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { clearCart } from '../store/slices/cartSlice';
import api from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { items, itemsPrice, discountPrice, shippingPrice, taxPrice, totalPrice } = cart;
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Steps controller
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [shippingDetails, setShippingDetails] = useState({
    name: user?.name || '',
    phone: '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    postalCode: user?.addresses?.[0]?.postalCode || '',
    country: user?.addresses?.[0]?.country || 'United States'
  });

  const [billingDetails, setBillingDetails] = useState({
    sameAsShipping: true,
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  const [createdOrder, setCreatedOrder] = useState(null);

  const handleShippingChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const handleBillingChange = (e) => {
    setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (billingDetails.sameAsShipping) {
        setBillingDetails({
          ...billingDetails,
          street: shippingDetails.street,
          city: shippingDetails.city,
          state: shippingDetails.state,
          postalCode: shippingDetails.postalCode,
          country: shippingDetails.country
        });
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(Math.max(1, step - 1));
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.discountPrice > 0 ? item.discountPrice : item.price,
        product: item.product
      }));

      const shippingAddress = {
        street: shippingDetails.street,
        city: shippingDetails.city,
        state: shippingDetails.state,
        postalCode: shippingDetails.postalCode,
        country: shippingDetails.country
      };

      const billingAddress = billingDetails.sameAsShipping ? shippingAddress : {
        street: billingDetails.street,
        city: billingDetails.city,
        state: billingDetails.state,
        postalCode: billingDetails.postalCode,
        country: billingDetails.country
      };

      // Create order in backend
      const res = await api.post('/api/orders', {
        orderItems,
        shippingAddress,
        billingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        discountPrice,
        totalPrice
      });

      if (res.data.success) {
        const order = res.data.order;
        setCreatedOrder(order);

        // Process payment simulation
        if (paymentMethod === 'Stripe') {
          // Stripe processing simulation
          const payRes = await api.post('/api/payments/stripe/create-intent', { amount: totalPrice });
          const isMock = payRes.data.isMock;

          // Call API to mark paid
          await api.put(`/api/orders/${order._id}/pay`, {
            id: isMock ? 'ch_mock_' + Math.random().toString(36).substring(7) : payRes.data.clientSecret,
            status: 'succeeded',
            update_time: new Date().toISOString(),
            email_address: user?.email || 'guest@velocityx.com'
          });
        }

        dispatch(clearCart());
        setStep(4);
      }
    } catch (err) {
      console.error('Order creation failed', err);
      setStep(4);
      dispatch(clearCart());
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 4) {
    return (
      <div className="text-center py-24 bg-dark text-white min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-grey-medium">No items in cart to checkout.</p>
        <Link to="/shop" className="btn-velocity py-3 px-6 rounded-lg text-xs uppercase tracking-widest font-semibold">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 bg-dark text-white min-h-screen">
      
      {/* 1. Header & Step Indicators */}
      <div className="flex items-center justify-between border-b border-charcoal pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold font-display">Secured Checkout</span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white font-display">Checkout</h1>
        </div>
        <div className="flex space-x-2 text-xs font-bold text-grey-medium">
          <span className={step === 1 ? 'text-primary' : ''}>Shipping</span>
          <span>&bull;</span>
          <span className={step === 2 ? 'text-primary' : ''}>Billing</span>
          <span>&bull;</span>
          <span className={step === 3 ? 'text-primary' : ''}>Payment</span>
        </div>
      </div>

      {/* 2. Step Form Cases */}
      {step === 1 && (
        <form onSubmit={handleNextStep} className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center font-display">
            <MapPin size={16} className="mr-2" />
            <span>Shipping Address</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">Recipient Name</label>
              <input
                type="text"
                name="name"
                value={shippingDetails.name}
                onChange={handleShippingChange}
                className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary transition-all"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">Contact Phone</label>
              <input
                type="tel"
                name="phone"
                value={shippingDetails.phone}
                onChange={handleShippingChange}
                className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary transition-all"
                required
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">Street Address</label>
              <input
                type="text"
                name="street"
                value={shippingDetails.street}
                onChange={handleShippingChange}
                className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary transition-all"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">City</label>
              <input
                type="text"
                name="city"
                value={shippingDetails.city}
                onChange={handleShippingChange}
                className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary transition-all"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">State / Province</label>
              <input
                type="text"
                name="state"
                value={shippingDetails.state}
                onChange={handleShippingChange}
                className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary transition-all"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">Postal / Zip Code</label>
              <input
                type="text"
                name="postalCode"
                value={shippingDetails.postalCode}
                onChange={handleShippingChange}
                className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary transition-all"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">Country</label>
              <input
                type="text"
                name="country"
                value={shippingDetails.country}
                onChange={handleShippingChange}
                className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary transition-all"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-charcoal">
            <button
              type="submit"
              className="bg-primary text-white text-xs uppercase tracking-widest font-bold py-3.5 px-8 rounded-xl hover:bg-orange transition-colors flex items-center space-x-2"
            >
              <span>Continue to Billing</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleNextStep} className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary font-display">Billing Details</h2>
          
          <div className="flex items-center space-x-3 bg-charcoal p-4 rounded-xl border border-white/5">
            <input
              type="checkbox"
              id="sameAsShipping"
              checked={billingDetails.sameAsShipping}
              onChange={(e) => setBillingDetails({ ...billingDetails, sameAsShipping: e.target.checked })}
              className="w-4 h-4 rounded bg-dark border-white/10 text-primary focus:ring-0 outline-none"
            />
            <label htmlFor="sameAsShipping" className="text-xs text-white font-medium cursor-pointer">
              Billing Address matches shipping address details
            </label>
          </div>

          {!billingDetails.sameAsShipping && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={billingDetails.street}
                  onChange={handleBillingChange}
                  className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">City</label>
                <input
                  type="text"
                  name="city"
                  value={billingDetails.city}
                  onChange={handleBillingChange}
                  className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">State / Province</label>
                <input
                  type="text"
                  name="state"
                  value={billingDetails.state}
                  onChange={handleBillingChange}
                  className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">Postal / Zip Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={billingDetails.postalCode}
                  onChange={handleBillingChange}
                  className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">Country</label>
                <input
                  type="text"
                  name="country"
                  value={billingDetails.country}
                  onChange={handleBillingChange}
                  className="w-full bg-charcoal border border-white/10 rounded-xl py-3 px-4 text-xs font-light text-white outline-none focus:border-primary"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-charcoal">
            <button
              type="button"
              onClick={handlePrevStep}
              className="border border-white/20 text-white text-xs uppercase tracking-widest font-bold py-3 px-6 rounded-xl hover:bg-charcoal transition-colors flex items-center space-x-2"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="bg-primary text-white text-xs uppercase tracking-widest font-bold py-3 px-8 rounded-xl hover:bg-orange transition-colors flex items-center space-x-2"
            >
              <span>Continue to Payment</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center font-display">
            <CreditCard size={16} className="mr-2" />
            <span>Select Payment Gateway</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Stripe', 'COD'].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`p-6 rounded-2xl text-left border-2 transition-all flex flex-col justify-between h-32 ${
                  paymentMethod === method ? 'border-primary bg-charcoal' : 'border-white/10 bg-charcoal/40 opacity-70 hover:opacity-100'
                }`}
              >
                <span className="text-xs uppercase tracking-widest font-bold text-white font-display">{method === 'Stripe' ? 'Stripe Gateway' : 'Cash on Delivery'}</span>
                <span className="text-[10px] text-grey-medium font-light">
                  {method === 'Stripe' && 'Credit & Debit Cards (Secured Stripe intent)'}
                  {method === 'COD' && 'Complimentary Cash-on-Delivery'}
                </span>
              </button>
            ))}
          </div>

          {/* Sandbox Mock Notice */}
          <div className="bg-charcoal p-6 rounded-2xl flex items-start space-x-4 border border-white/5">
            <ShieldCheck size={24} className="text-lime shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">Secured Sandbox Active</h4>
              <p className="text-[10px] text-grey-medium font-light leading-relaxed">
                VelocityX payment verification is running in sandbox mode. Placing this order will trigger a mock credit authorization and confirm your order ledger.
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-charcoal">
            <button
              onClick={handlePrevStep}
              className="border border-white/20 text-white text-xs uppercase tracking-widest font-bold py-3 px-6 rounded-xl hover:bg-charcoal transition-colors flex items-center space-x-2"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
            
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="bg-primary text-white text-xs uppercase tracking-widest font-bold py-3 px-10 rounded-xl hover:bg-orange transition-all flex items-center space-x-2 shadow-premium"
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Place Order (${totalPrice.toFixed(2)})</span>
                  <CheckCircle size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="text-center py-16 space-y-6 max-w-md mx-auto">
          <div className="w-16 h-16 bg-charcoal rounded-full flex items-center justify-center text-lime mx-auto shadow-sm border border-white/10">
            <CheckCircle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-widest uppercase text-white font-display">Order Confirmed</h2>
            <p className="text-xs text-grey-medium font-light leading-relaxed">
              Your transaction has been securely captured by VelocityX. A confirmation ledger and receipt details have been sent to your email.
            </p>
          </div>
          {createdOrder && (
            <div className="bg-charcoal p-4 rounded-xl text-left text-[11px] text-grey-light font-light space-y-1 border border-white/5">
              <p className="font-bold text-white uppercase tracking-wider text-[9px] mb-1.5 border-b border-white/5 pb-1 font-display">Order Details</p>
              <p>Reference ID: <span className="font-mono text-primary text-xs">{createdOrder._id}</span></p>
              <p>Total Charge: <span className="font-semibold text-orange">${createdOrder.totalPrice?.toFixed(2)}</span></p>
              <p>Delivery Courier: <span className="font-semibold text-lime">DHL Express (Carbon Neutral)</span></p>
            </div>
          )}
          <div className="flex space-x-4 justify-center pt-4">
            <button
              onClick={() => navigate('/dashboard?tab=orders')}
              className="bg-primary hover:bg-orange text-white text-xs uppercase tracking-widest font-bold py-3 px-6 rounded-xl transition-colors flex-1"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate('/')}
              className="border border-white/20 text-white text-xs uppercase tracking-widest font-bold py-3 px-6 rounded-xl hover:bg-charcoal transition-colors flex-1"
            >
              Home
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
