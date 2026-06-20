import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';

const Wishlist = () => {
  const wishlist = useSelector((state) => state.wishlist);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8">
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-grey">Saved Pieces</span>
        <h1 className="text-3xl tracking-widest uppercase font-light">Your Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-luxury-lightGrey rounded-2xl space-y-4">
          <p className="text-sm text-luxury-grey font-light">Your wishlist is currently empty.</p>
          <Link
            to="/shop"
            className="inline-block bg-primary text-white text-xs uppercase tracking-widest font-bold py-3 px-8 rounded-xl hover:bg-luxury-dark transition-colors"
          >
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
