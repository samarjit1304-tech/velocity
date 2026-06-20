import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Heart, User, Menu, X, Search, Settings } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import api from '../../services/api';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlist = useSelector((state) => state.wishlist);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart quantity count
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('vibe_refresh_token');
    try {
      if (refreshToken) {
        await api.post('/api/auth/logout', { refreshToken });
      }
    } catch (err) {
      console.error('Logout error', err);
    }
    dispatch(logout());
    navigate('/');
  };

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Running', path: '/shop?category=running' },
    { name: 'Training', path: '/shop?category=training' },
    { name: 'Football', path: '/shop?category=football' },
    { name: 'Basketball', path: '/shop?category=basketball' },
    { name: 'Outdoor', path: '/shop?category=outdoor' },
    { name: 'Blog', path: '/blog' }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled || mobileMenuOpen
            ? 'glass-nav py-4 shadow-sm'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold tracking-[0.1em] text-white font-display flex items-center gap-1"
          >
            <span className="text-primary">VELOCITY</span>
            <span className="text-orange font-light italic">X</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-xs uppercase tracking-widest font-medium hover:text-luxury-grey transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-6">
            
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-primary hover:text-luxury-grey transition-colors"
              aria-label="Search products"
            >
              <Search size={18} />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative text-primary hover:text-luxury-grey transition-colors"
              aria-label="View Wishlist"
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative text-primary hover:text-luxury-grey transition-colors"
              aria-label="View Cart"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="text-primary hover:text-luxury-grey transition-colors flex items-center"
                aria-label="User profile"
              >
                <User size={18} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-4 w-52 bg-charcoal rounded-xl shadow-hover border border-white/10 py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200 text-white">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-white/5 mb-1">
                        <p className="text-[10px] text-grey-medium font-light">Signed in as</p>
                        <p className="text-xs font-semibold text-primary truncate font-display">{user.name}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-xs text-grey-light hover:bg-dark hover:text-primary transition-colors"
                      >
                        User Dashboard
                      </Link>
                      <Link
                        to="/dashboard?tab=orders"
                        className="block px-4 py-2 text-xs text-grey-light hover:bg-dark hover:text-primary transition-colors"
                      >
                        Order History
                      </Link>
                      {user && user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-xs text-orange font-medium hover:bg-dark hover:text-orange transition-colors flex items-center"
                        >
                          <Settings size={12} className="mr-1.5" />
                          Admin Console
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-xs text-red hover:bg-red/10 transition-colors border-t border-white/5 mt-1"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-xs text-grey-light hover:bg-dark hover:text-primary transition-colors font-medium"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-xs text-grey-light hover:bg-dark hover:text-primary transition-colors"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-primary hover:text-luxury-grey transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden w-full bg-dark border-t border-white/10 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block text-xs uppercase tracking-widest font-semibold text-white hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/5">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 text-xs font-semibold rounded-lg bg-primary text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 text-xs font-medium rounded-lg border border-white/10 text-white"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* VelocityX Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-dark/75 backdrop-blur-md z-[60] flex items-start justify-center pt-32 px-6">
          <div className="w-full max-w-2xl glass-card rounded-2xl shadow-hover border border-white/10 p-6 relative animate-in fade-in slide-in-from-top-6 duration-300 text-white">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 text-grey-medium hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-xs uppercase tracking-[0.2em] text-grey-light font-display font-semibold mb-3">
              Search VelocityX Gear
            </h3>
            <form onSubmit={handleSearchSubmit} className="flex space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Running shoes, tracksuits, windbreakers, cleats..."
                className="w-full bg-charcoal border border-white/10 text-sm py-3 px-4 rounded-xl focus:ring-1 focus:ring-primary outline-none font-light text-white"
                autoFocus
              />
              <button
                type="submit"
                className="bg-primary hover:bg-orange text-white px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
