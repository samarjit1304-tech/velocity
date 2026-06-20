import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag } from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlistLocal, removeFromWishlistLocal } from '../../store/slices/wishlistSlice';
import api from '../../services/api';
import Rating from './Rating';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [hovered, setHovered] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const wishlist = useSelector((state) => state.wishlist);

  const isWishlisted = wishlist.some(item => item._id === product._id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAuthenticated) {
      try {
        const res = await api.post('/api/users/wishlist', { productId: product._id });
        if (res.data.success) {
          // Sync wishlist items
          const populatedWish = res.data.wishlist;
          // Set in store
          const { setWishlist } = await import('../../store/slices/wishlistSlice');
          dispatch(setWishlist(populatedWish));
        }
      } catch (err) {
        console.error('Wishlist sync failed', err);
      }
    } else {
      // Local fallback
      if (isWishlisted) {
        dispatch(removeFromWishlistLocal(product._id));
      } else {
        dispatch(addToWishlistLocal(product));
      }
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      discountPrice: product.discountPrice,
      qty: 1,
      stockCount: product.stockCount
    }));

    // Temporary toast or feedback could go here
  };

  const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;

  return (
    <div
      className="group relative flex flex-col justify-between overflow-hidden glass-card p-3 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/products/${product._id}`} className="block relative w-full overflow-hidden rounded-xl bg-charcoal aspect-[4/5]">
        {/* Main/Hover Image Switcher */}
        <img
          src={hovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Sale/Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-lime text-dark text-[9px] uppercase tracking-widest px-2.5 py-1 font-bold rounded-md">
            Sale
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 bg-dark/65 hover:bg-dark text-white rounded-full p-2 shadow-premium backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 border border-white/5"
          aria-label="Add to wishlist"
        >
          <Heart
            size={14}
            className={`transition-colors duration-300 ${isWishlisted ? 'fill-primary stroke-primary' : 'stroke-white'}`}
          />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-3 bottom-3 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <button
            onClick={handleAddToCart}
            disabled={product.stockCount === 0}
            className={`w-full py-2.5 px-3 rounded-lg flex items-center justify-center space-x-1.5 text-[10px] uppercase tracking-widest font-semibold shadow-premium transition-all duration-300 ${
              product.stockCount === 0
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-primary hover:bg-orange text-white'
            }`}
          >
            <ShoppingBag size={12} />
            <span>{product.stockCount === 0 ? 'Sold Out' : 'Quick Add'}</span>
          </button>
        </div>
      </Link>

      <div className="mt-3 flex flex-col space-y-1 px-1">
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-widest text-grey-medium font-light">
            {product.brand}
          </span>
          <Rating value={product.rating} size={9} />
        </div>

        <Link to={`/products/${product._id}`} className="text-xs font-semibold tracking-wide text-white hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </Link>

        <div className="flex items-baseline space-x-2">
          {hasDiscount ? (
            <>
              <span className="text-xs font-bold text-orange">${product.discountPrice.toFixed(2)}</span>
              <span className="text-[10px] text-grey-medium line-through font-light">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-xs font-bold text-white">${product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
