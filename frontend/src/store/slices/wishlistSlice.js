import { createSlice } from '@reduxjs/toolkit';

const getInitialWishlist = () => {
  try {
    const list = localStorage.getItem('vibe_wishlist');
    if (list) {
      return JSON.parse(list);
    }
  } catch (e) {
    console.error('Failed to load initial wishlist state', e);
  }
  return [];
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: getInitialWishlist(),
  reducers: {
    setWishlist: (state, action) => {
      const items = action.payload;
      localStorage.setItem('vibe_wishlist', JSON.stringify(items));
      return items;
    },
    addToWishlistLocal: (state, action) => {
      const product = action.payload;
      const exists = state.find(item => item._id === product._id);
      if (!exists) {
        state.push(product);
      }
      localStorage.setItem('vibe_wishlist', JSON.stringify(state));
    },
    removeFromWishlistLocal: (state, action) => {
      const productId = action.payload;
      const updated = state.filter(item => item._id !== productId);
      localStorage.setItem('vibe_wishlist', JSON.stringify(updated));
      return updated;
    },
    clearWishlist: () => {
      localStorage.removeItem('vibe_wishlist');
      return [];
    }
  }
});

export const { setWishlist, addToWishlistLocal, removeFromWishlistLocal, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
