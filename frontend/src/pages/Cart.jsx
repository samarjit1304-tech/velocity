import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ArrowRight, Ticket, X } from 'lucide-react';
import { updateCartItemQty, removeFromCart, applyCoupon, removeCoupon } from '../store/slices/cartSlice';
import api from '../services/api';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { items, coupon, itemsPrice, discountPrice, shippingPrice, taxPrice, totalPrice } = cart;

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleQtyChange = (product, qty) => {
    dispatch(updateCartItemQty({ product, qty }));
  };

  const handleRemove = (product) => {
    dispatch(removeFromCart(product));
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setCouponError('');
      setCouponSuccess('');
      
      const res = await api.post('/api/coupons/validate', {
        code: couponCode,
        amount: itemsPrice
      });

      if (res.data.success) {
        dispatch(applyCoupon({
          code: couponCode.toUpperCase(),
          discountPercent: res.data.discountPercent
        }));
        setCouponSuccess(`Coupon ${couponCode.toUpperCase()} applied successfully!`);
        setCouponCode('');
      }
    } catch (err) {
      // Mock validation fallback for local testing
      const codeUpper = couponCode.toUpperCase();
      if (codeUpper === 'VELOCITY10' || codeUpper === 'LIMITLESS20') {
        const percent = codeUpper === 'VELOCITY10' ? 10 : 20;
        dispatch(applyCoupon({
          code: codeUpper,
          discountPercent: percent
        }));
        setCouponSuccess(`Coupon ${codeUpper} applied! (local simulation)`);
        setCouponCode('');
      } else {
        setCouponError(err.response?.data?.message || 'Invalid coupon code');
      }
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponSuccess('');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8 bg-dark text-white min-h-screen">
      <div>
        <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold font-display">Your Selection</span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-display">Shopping Bag</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-charcoal rounded-2xl space-y-4">
          <p className="text-sm text-grey-medium font-light">Your shopping bag is empty.</p>
          <Link
            to="/shop"
            className="btn-velocity text-white text-xs py-3.5 px-8 rounded-xl font-bold"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {items.map((item) => {
              const activeItemPrice = item.discountPrice > 0 ? item.discountPrice : item.price;
              return (
                <div
                  key={item.product}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-charcoal rounded-2xl gap-4 border border-white/5"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl bg-dark"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">{item.name}</h4>
                      {item.size && <p className="text-[10px] text-grey-medium uppercase tracking-wider">Size: {item.size}</p>}
                      {item.color && <p className="text-[10px] text-grey-medium uppercase tracking-wider">Color: {item.color}</p>}
                      <p className="text-xs text-orange font-semibold mt-1">
                        ${activeItemPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8">
                    
                    {/* Quantity Adjustment */}
                    <div className="flex items-center border border-white/10 bg-dark rounded-xl overflow-hidden">
                      <button
                        onClick={() => handleQtyChange(item.product, Math.max(1, item.qty - 1))}
                        className="px-3 py-1.5 hover:bg-charcoal transition-colors text-xs font-semibold"
                      >
                        -
                      </button>
                      <span className="px-4 text-xs font-semibold text-white">{item.qty}</span>
                      <button
                        onClick={() => handleQtyChange(item.product, Math.min(item.stockCount, item.qty + 1))}
                        className="px-3 py-1.5 hover:bg-charcoal transition-colors text-xs font-semibold"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <span className="text-sm font-bold text-white font-display">
                      ${(activeItemPrice * item.qty).toFixed(2)}
                    </span>

                    {/* Remove item */}
                    <button
                      onClick={() => handleRemove(item.product)}
                      className="text-grey-medium hover:text-red transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing summary & Checkout Bridge */}
          <div className="lg:col-span-4 bg-charcoal p-6 rounded-2xl space-y-6 border border-white/5">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white font-display border-b border-white/10 pb-2">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs font-light text-grey-light">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">${itemsPrice.toFixed(2)}</span>
              </div>
              
              {discountPrice > 0 && (
                <div className="flex justify-between text-lime font-bold">
                  <span>Discount ({coupon?.code})</span>
                  <span>-${discountPrice.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-bold text-white">
                  {shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span className="font-bold text-white">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-white/10 font-display">
                <span>Estimated Total</span>
                <span className="text-orange font-black">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="pt-2">
              {coupon ? (
                <div className="flex items-center justify-between bg-dark px-3 py-2.5 rounded-xl text-xs text-lime font-bold border border-lime/20">
                  <div className="flex items-center">
                    <Ticket size={14} className="mr-1.5" />
                    <span>Applied: {coupon.code} (-{coupon.discountPercent}%)</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-grey-medium hover:text-white">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code (VELOCITY10)"
                    className="w-full bg-dark border border-white/10 rounded-xl py-2 px-3 text-xs outline-none uppercase font-semibold text-white placeholder-grey-medium"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white text-xs uppercase tracking-widest font-bold px-4 rounded-xl hover:bg-orange transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[10px] text-red mt-1">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] text-lime mt-1">{couponSuccess}</p>}
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-primary hover:bg-orange text-white rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2 shadow-premium transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
