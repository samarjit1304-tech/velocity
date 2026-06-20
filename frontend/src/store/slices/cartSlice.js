import { createSlice } from '@reduxjs/toolkit';

const calculateCartTotals = (state) => {
  // Items price sum
  state.itemsPrice = state.items.reduce((sum, item) => {
    const activePrice = item.discountPrice > 0 ? item.discountPrice : item.price;
    return sum + activePrice * item.qty;
  }, 0);

  // Apply coupon discount
  if (state.coupon) {
    state.discountPrice = (state.itemsPrice * state.coupon.discountPercent) / 100;
  } else {
    state.discountPrice = 0;
  }

  const discountableTotal = state.itemsPrice - state.discountPrice;

  // Shipping Calculation: Free above $200, else $15
  state.shippingPrice = discountableTotal > 200 || discountableTotal === 0 ? 0 : 15;

  // Tax Calculation: 8.5%
  state.taxPrice = discountableTotal * 0.085;

  // Grand Total
  state.totalPrice = discountableTotal + state.shippingPrice + state.taxPrice;

  // Round values
  state.itemsPrice = Math.round(state.itemsPrice * 100) / 100;
  state.discountPrice = Math.round(state.discountPrice * 100) / 100;
  state.shippingPrice = Math.round(state.shippingPrice * 100) / 100;
  state.taxPrice = Math.round(state.taxPrice * 100) / 100;
  state.totalPrice = Math.round(state.totalPrice * 100) / 100;

  // Persist to localStorage
  localStorage.setItem('vibe_cart', JSON.stringify({
    items: state.items,
    coupon: state.coupon,
    itemsPrice: state.itemsPrice,
    discountPrice: state.discountPrice,
    shippingPrice: state.shippingPrice,
    taxPrice: state.taxPrice,
    totalPrice: state.totalPrice
  }));
};

const getInitialCart = () => {
  try {
    const cart = localStorage.getItem('vibe_cart');
    if (cart) {
      return JSON.parse(cart);
    }
  } catch (e) {
    console.error('Failed to load initial cart state', e);
  }
  return {
    items: [],
    coupon: null,
    itemsPrice: 0,
    discountPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0
  };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: getInitialCart(),
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existItem = state.items.find(item => item.product === newItem.product);

      if (existItem) {
        // Prevent exceeding stock count
        const targetQty = existItem.qty + newItem.qty;
        existItem.qty = targetQty > newItem.stockCount ? newItem.stockCount : targetQty;
      } else {
        state.items.push(newItem);
      }
      calculateCartTotals(state);
    },
    updateCartItemQty: (state, action) => {
      const { product, qty } = action.payload;
      const item = state.items.find(item => item.product === product);
      if (item) {
        item.qty = qty;
      }
      calculateCartTotals(state);
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product !== productId);
      calculateCartTotals(state);
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload; // expect { code, discountPercent }
      calculateCartTotals(state);
    },
    removeCoupon: (state) => {
      state.coupon = null;
      calculateCartTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.itemsPrice = 0;
      state.discountPrice = 0;
      state.shippingPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
      localStorage.removeItem('vibe_cart');
    }
  }
});

export const { addToCart, updateCartItemQty, removeFromCart, applyCoupon, removeCoupon, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
