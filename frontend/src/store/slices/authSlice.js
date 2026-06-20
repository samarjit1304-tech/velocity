import { createSlice } from '@reduxjs/toolkit';

const getInitialAuth = () => {
  try {
    const user = localStorage.getItem('vibe_user');
    const token = localStorage.getItem('vibe_token');
    const refreshToken = localStorage.getItem('vibe_refresh_token');
    if (user && token) {
      return {
        user: JSON.parse(user),
        token,
        refreshToken,
        isAuthenticated: true,
        loading: false
      };
    }
  } catch (e) {
    console.error('Failed to load initial auth state', e);
  }
  return {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuth(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem('vibe_user', JSON.stringify(user));
      localStorage.setItem('vibe_token', accessToken);
      localStorage.setItem('vibe_refresh_token', refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('vibe_user');
      localStorage.removeItem('vibe_token');
      localStorage.removeItem('vibe_refresh_token');
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('vibe_user', JSON.stringify(state.user));
    },
    setAddresses: (state, action) => {
      if (state.user) {
        state.user.addresses = action.payload;
        localStorage.setItem('vibe_user', JSON.stringify(state.user));
      }
    },
    updateWishlist: (state, action) => {
      if (state.user) {
        state.user.wishlist = action.payload;
        localStorage.setItem('vibe_user', JSON.stringify(state.user));
      }
    },
    setVerifiedStatus: (state, action) => {
      if (state.user) {
        state.user.isVerified = action.payload;
        localStorage.setItem('vibe_user', JSON.stringify(state.user));
      }
    }
  }
});

export const { setCredentials, logout, updateProfile, setAddresses, updateWishlist, setVerifiedStatus } = authSlice.actions;
export default authSlice.reducer;
