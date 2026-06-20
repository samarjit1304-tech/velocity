import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Heart, Star, ShieldCheck, Truck, RefreshCw, ZoomIn, Rotate3d, Info } from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlistLocal, removeFromWishlistLocal } from '../store/slices/wishlistSlice';
import api from '../services/api';
import Rating from '../components/common/Rating';
import ProductCard from '../components/common/ProductCard';
import { SkeletonDetails } from '../components/common/Skeleton';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const wishlist = useSelector(state => state.wishlist);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery and Variant controllers
  const [activeImage, setActiveImage] = useState('');
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState('features');

  // Simulated 360 Viewer State
  const [is360Active, setIs360Active] = useState(false);
  const [rotationIndex, setRotationIndex] = useState(0);
  const dragStartRef = useRef(0);

  // Review submission state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState({ type: '', text: '' });

  const isWishlisted = wishlist.some(item => item._id === product?._id);

  // Sizing chart arrays based on categories
  const shoeSizes = ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'];
  const apparelSizes = ['S', 'M', 'L', 'XL'];
  const colorOptions = ['Stealth Black', 'Electric Blue', 'Velocity Orange', 'Neon Lime'];

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/products/${id}`);
        if (res.data.success) {
          const prod = res.data.product;
          setProduct(prod);
          setReviews(res.data.reviews || []);
          setActiveImage(prod.images[0]);
          
          // Pre-select first values
          setSelectedColor(colorOptions[0]);
          const isShoe = prod.sku?.includes('RUN') || prod.sku?.includes('TRN') || prod.sku?.includes('FTB') || prod.sku?.includes('BKB') || prod.sku?.includes('LFT');
          setSelectedSize(isShoe ? shoeSizes[2] : apparelSizes[1]); // US 9 or M default

          updateRecentlyViewed(prod);

          // Fetch related products
          const relatedRes = await api.get(`/api/products?category=${prod.category?.slug || 'running'}&limit=4`);
          if (relatedRes.data.success) {
            setRelatedProducts(relatedRes.data.products.filter(p => p._id !== prod._id));
          }
        } else {
          loadMockDetails();
        }
      } catch (err) {
        console.error('Failed to load product details', err);
        loadMockDetails();
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const history = localStorage.getItem('vibe_recent_views');
    if (history) {
      setRecentlyViewed(JSON.parse(history).filter(p => p._id !== id));
    }
  }, [id]);

  const loadMockDetails = () => {
    const mockList = getMockDetailsProducts();
    const found = mockList.find(p => p._id === id) || mockList[0];
    setProduct(found);
    setReviews([
      { _id: 'r1', name: 'Marcus Jenkins', rating: 5, comment: 'Absolutely stellar performance. The responsive cushioning is incredible.', createdAt: new Date() },
      { _id: 'r2', name: 'Elena Rostova', rating: 4, comment: 'Very stable flat grip platform. Perfect for powerlifts.', createdAt: new Date() }
    ]);
    setActiveImage(found.images[0]);
    setSelectedColor(colorOptions[0]);
    const isShoe = found.sku?.includes('RUN') || found.sku?.includes('TRN') || found.sku?.includes('FTB') || found.sku?.includes('BKB') || found.sku?.includes('LFT');
    setSelectedSize(isShoe ? shoeSizes[2] : apparelSizes[1]);

    updateRecentlyViewed(found);
    setRelatedProducts(mockList.filter(p => p._id !== found._id).slice(0, 3));
  };

  const updateRecentlyViewed = (prod) => {
    let list = [];
    const history = localStorage.getItem('vibe_recent_views');
    if (history) {
      list = JSON.parse(history);
    }
    list = list.filter(item => item._id !== prod._id);
    list.unshift({
      _id: prod._id,
      name: prod.name,
      price: prod.price,
      discountPrice: prod.discountPrice,
      images: prod.images,
      brand: prod.brand,
      rating: prod.rating
    });
    list = list.slice(0, 4);
    localStorage.setItem('vibe_recent_views', JSON.stringify(list));
  };

  const handleWishlistToggle = async () => {
    if (isAuthenticated) {
      try {
        const res = await api.post('/api/users/wishlist', { productId: product._id });
        if (res.data.success) {
          const populatedWish = res.data.wishlist;
          const { setWishlist } = await import('../store/slices/wishlistSlice');
          dispatch(setWishlist(populatedWish));
        }
      } catch (err) {
        console.error('Wishlist sync failed', err);
      }
    } else {
      if (isWishlisted) {
        dispatch(removeFromWishlistLocal(product._id));
      } else {
        dispatch(addToWishlistLocal(product));
      }
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      discountPrice: product.discountPrice,
      qty,
      size: selectedSize,
      color: selectedColor,
      stockCount: product.stockCount
    }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  // 360 Drag Interaction
  const handleDragStart = (e) => {
    if (!is360Active) return;
    dragStartRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  };

  const handleDragMove = (e) => {
    if (!is360Active || dragStartRef.current === 0) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const diff = clientX - dragStartRef.current;
    
    // Change image every 15 pixels of drag
    if (Math.abs(diff) > 15) {
      const step = diff > 0 ? -1 : 1;
      const numImages = product.images.length;
      let nextIndex = (rotationIndex + step) % numImages;
      if (nextIndex < 0) nextIndex = numImages - 1;
      
      setRotationIndex(nextIndex);
      setActiveImage(product.images[nextIndex]);
      dragStartRef.current = clientX;
    }
  };

  const handleDragEnd = () => {
    dragStartRef.current = 0;
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    try {
      const res = await api.post(`/api/products/${product._id}/reviews`, {
        rating: userRating,
        comment: userComment
      });

      if (res.data.success) {
        setReviews([res.data.review, ...reviews]);
        setUserComment('');
        setReviewMessage({ type: 'success', text: 'Review published successfully.' });
      }
    } catch (err) {
      setReviewMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit review. You might have already reviewed this product.'
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <SkeletonDetails />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-white min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-grey-medium">Product not found.</p>
        <Link to="/shop" className="btn-velocity py-3 px-6 rounded-lg text-xs uppercase tracking-widest font-semibold">Return to Shop</Link>
      </div>
    );
  }

  const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  
  // Decide sizing options (shoes vs apparel)
  const isShoeItem = product.sku?.includes('RUN') || product.sku?.includes('TRN') || product.sku?.includes('FTB') || product.sku?.includes('BKB') || product.sku?.includes('LFT');
  const sizeOptions = isShoeItem ? shoeSizes : apparelSizes;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-24 text-white bg-dark">
      
      {/* 1. Main Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Gallery Slider Column */}
        <div className="lg:col-span-7 space-y-4">
          <div 
            className="aspect-square w-full rounded-2xl overflow-hidden bg-charcoal relative group border border-white/5 cursor-grab active:cursor-grabbing"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500"
              draggable="false"
            />
            
            {/* 360 mode indicator badge */}
            <button
              onClick={() => {
                setIs360Active(!is360Active);
                if (!is360Active) {
                  // Switch to 360 description
                  alert("360° interactive view active. Drag horizontally across the product image to rotate angles!");
                }
              }}
              className={`absolute top-4 left-4 flex items-center space-x-1 px-3 py-1.5 rounded-full text-[9px] uppercase tracking-wider font-bold shadow-md border ${
                is360Active 
                  ? 'bg-lime text-dark border-lime animate-pulse' 
                  : 'bg-dark/70 text-white border-white/10 hover:bg-dark'
              }`}
            >
              <Rotate3d size={12} />
              <span>{is360Active ? '360° Active (Drag)' : 'Interactive 360°'}</span>
            </button>

            <span className="absolute bottom-4 right-4 bg-dark/70 border border-white/10 p-2.5 rounded-full text-white shadow-sm pointer-events-none">
              <ZoomIn size={16} />
            </span>
          </div>

          {/* Thumbnails grid */}
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveImage(img);
                  setIs360Active(false);
                }}
                className={`aspect-square rounded-xl overflow-hidden bg-charcoal border-2 transition-all ${
                  activeImage === img ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-bold font-display">{product.brand}</span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white font-display leading-tight">{product.name}</h1>
            
            <div className="flex items-center space-x-4 pt-1">
              <Rating value={product.rating} text={`(${reviews.length} reviews)`} />
              <span className={`text-[10px] uppercase tracking-widest font-bold ${product.stockCount > 0 ? 'text-lime' : 'text-red'}`}>
                {product.stockCount > 0 ? `In Stock (${product.stockCount})` : 'Sold Out'}
              </span>
            </div>
          </div>

          <div className="flex items-baseline space-x-2 border-y border-charcoal py-4">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-black text-orange font-display">${product.discountPrice.toFixed(2)}</span>
                <span className="text-sm text-grey-medium line-through font-light">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-2xl font-black text-white font-display">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-xs text-grey-light font-light leading-relaxed">
            {product.description}
          </p>

          {/* Sizing selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-widest font-semibold text-grey-light">Select Size</span>
              <button className="text-[10px] text-primary hover:underline font-bold uppercase tracking-wider">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map(sz => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-12 h-10 rounded-lg text-xs font-bold transition-all border ${
                    selectedSize === sz 
                      ? 'bg-primary border-primary text-white' 
                      : 'border-white/10 bg-charcoal hover:border-grey-medium text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color bubble selection */}
          <div className="space-y-2.5">
            <span className="text-xs uppercase tracking-widest font-semibold text-grey-light">Select Color</span>
            <div className="flex gap-3">
              {colorOptions.map(col => (
                <button
                  key={col}
                  onClick={() => setSelectedColor(col)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                    selectedColor === col 
                      ? 'bg-orange border-orange text-white' 
                      : 'border-white/10 bg-charcoal hover:border-grey-medium text-grey-light'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          {product.stockCount > 0 && (
            <div className="flex items-center space-x-4 pt-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-grey-light">Quantity</span>
              <div className="flex items-center border border-white/10 bg-charcoal rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-1.5 hover:bg-dark transition-colors text-xs font-semibold"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stockCount, qty + 1))}
                  className="px-3 py-1.5 hover:bg-dark transition-colors text-xs font-semibold"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stockCount === 0}
              className={`flex-1 py-4 px-6 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2 shadow-premium transition-all ${
                product.stockCount === 0
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-primary hover:bg-orange text-white'
              }`}
            >
              <ShoppingBag size={14} />
              <span>Add to Bag</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stockCount === 0}
              className={`flex-1 py-4 px-6 rounded-xl text-xs uppercase tracking-widest font-bold border shadow-premium transition-all ${
                product.stockCount === 0
                  ? 'border-charcoal text-neutral-600 cursor-not-allowed'
                  : 'border-white/20 text-white hover:bg-white hover:text-dark'
              }`}
            >
              Buy Now
            </button>

            <button
              onClick={handleWishlistToggle}
              className="border border-white/10 bg-charcoal rounded-xl p-4 flex items-center justify-center hover:border-primary transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart size={16} className={isWishlisted ? 'fill-primary stroke-primary text-primary' : 'stroke-white'} />
            </button>
          </div>

          {/* Logistics benefits */}
          <div className="space-y-3 pt-4 border-t border-charcoal text-[11px] font-light text-grey-light">
            <div className="flex items-center space-x-3">
              <Truck size={14} className="text-primary" />
              <span>Complimentary expedited carbon-neutral delivery</span>
            </div>
            <div className="flex items-center space-x-3">
              <RefreshCw size={14} className="text-orange" />
              <span>30-Day hassle-free athletic exchange policy</span>
            </div>
            <div className="flex items-center space-x-3">
              <ShieldCheck size={14} className="text-lime" />
              <span>Guaranteed lifetime structural stitching coverage</span>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Specs and Features Tabs */}
      <div className="border-t border-charcoal pt-10">
        <div className="flex space-x-8 border-b border-charcoal pb-2">
          <button
            onClick={() => setActiveTab('features')}
            className={`text-xs uppercase tracking-widest font-semibold pb-2 border-b-2 transition-all ${
              activeTab === 'features' ? 'border-primary text-primary font-bold' : 'border-transparent text-grey-medium hover:text-white'
            }`}
          >
            Features & Innovation
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`text-xs uppercase tracking-widest font-semibold pb-2 border-b-2 transition-all ${
              activeTab === 'specs' ? 'border-primary text-primary font-bold' : 'border-transparent text-grey-medium hover:text-white'
            }`}
          >
            Technical Specifications
          </button>
        </div>

        <div className="py-6 min-h-[150px]">
          {activeTab === 'features' ? (
            <ul className="list-disc pl-5 text-xs text-grey-light font-light space-y-3.5 max-w-2xl">
              {product.features && product.features.length > 0 ? (
                product.features.map((feat, idx) => <li key={idx} className="leading-relaxed">{feat}</li>)
              ) : (
                <>
                  <li className="leading-relaxed">Engineered using 3D anatomical molding to support high-speed performance movements.</li>
                  <li className="leading-relaxed">Advanced dry-wick surface drawing sweat away from skin instantly.</li>
                  <li className="leading-relaxed">Tested on professional track fields to withstand multi-terrain friction.</li>
                </>
              )}
            </ul>
          ) : (
            <div className="max-w-xl border border-charcoal rounded-2xl overflow-hidden bg-charcoal/30">
              <table className="w-full text-xs text-left text-grey-light">
                <tbody>
                  {product.specifications && product.specifications.length > 0 ? (
                    product.specifications.map((spec, idx) => (
                      <tr key={idx} className="border-b border-charcoal last:border-0 hover:bg-charcoal/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-primary uppercase tracking-wider w-1/3 font-display">{spec.name}</td>
                        <td className="px-6 py-4 font-light">{spec.value}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-4">No specific details available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 3. Product Reviews */}
      <div className="border-t border-charcoal pt-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Write Review Column */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-lg tracking-widest uppercase font-display font-bold">Client Reviews</h3>
          
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4 bg-charcoal p-6 rounded-2xl border border-white/5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-primary font-display">Submit a Review</h4>
              
              {reviewMessage.text && (
                <p className={`text-[10px] uppercase tracking-wider px-3 py-2 rounded-lg ${reviewMessage.type === 'success' ? 'bg-green-950 text-green-300' : 'bg-red-950 text-red-300'}`}>
                  {reviewMessage.text}
                </p>
              )}

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">Rating</span>
                <select
                  value={userRating}
                  onChange={(e) => setUserRating(Number(e.target.value))}
                  className="w-full bg-dark border border-white/10 rounded-xl py-2 px-3 text-xs outline-none text-white focus:border-primary"
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Good)</option>
                  <option value="3">3 Stars (Average)</option>
                  <option value="2">2 Stars (Poor)</option>
                  <option value="1">1 Star (Very Poor)</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-grey-medium font-semibold">Comment</span>
                <textarea
                  rows="4"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Share your thoughts on the performance and fit..."
                  className="w-full bg-dark border border-white/10 rounded-xl py-2 px-3 text-xs outline-none text-white focus:border-primary"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white text-xs uppercase tracking-widest font-bold py-3 rounded-xl hover:bg-orange transition-colors"
              >
                Submit Review
              </button>
            </form>
          ) : (
            <div className="bg-charcoal p-6 rounded-2xl text-center space-y-3 border border-white/5">
              <p className="text-xs text-grey-medium font-light">Please log in to leave a review.</p>
              <Link
                to="/login"
                className="inline-block bg-primary text-white text-xs uppercase tracking-widest font-bold py-2.5 px-6 rounded-xl hover:bg-orange transition-all"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Reviews List Column */}
        <div className="lg:col-span-8 space-y-6">
          {reviews.length === 0 ? (
            <p className="text-xs text-grey-medium font-light py-6 border border-dashed border-charcoal rounded-2xl text-center">
              No reviews have been written for this gear yet.
            </p>
          ) : (
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin">
              {reviews.map((rev) => (
                <div key={rev._id} className="border-b border-charcoal pb-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold tracking-wider text-white font-display">{rev.name}</h4>
                    <span className="text-[10px] text-grey-medium font-light">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <Rating value={rev.rating} size={12} />
                  <p className="text-xs text-grey-light font-light leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 4. Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-charcoal pt-10 space-y-6">
          <h3 className="text-lg tracking-widest uppercase font-display font-bold text-white">Related Products</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}

      {/* 5. Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <div className="border-t border-charcoal pt-10 space-y-6">
          <h3 className="text-lg tracking-widest uppercase font-display font-bold text-white">Recently Viewed</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

// Mock product records for details screen loading
const getMockDetailsProducts = () => {
  return [
    {
      _id: 'mock1',
      name: 'VelocityX ZoomFly V1',
      brand: 'VelocityX',
      price: 220.00,
      discountPrice: 195.00,
      rating: 4.8,
      stockCount: 25,
      sku: 'RUN-ZOOMFLY-01',
      description: 'Take your runs to the limit. The VelocityX ZoomFly V1 incorporates a rigid curved carbon-fiber plate sandwiched within reactive V-Zoom Nitro foam, returning energy with every stride. The upper features engineered AeroWeave mesh for targeted breathability and support.',
      features: [
        'Rigid curved carbon-fiber propulsion plate',
        'V-Zoom Nitro supercritical energy-return foam',
        'Engineered AeroWeave targeted breathing mesh',
        'Carbon-neutral, 84% ocean-plastic construction'
      ],
      specifications: [
        { name: 'Weight', value: '210 grams (size 9)' },
        { name: 'Heel Drop', value: '8 mm' },
        { name: 'Midsole Foam', value: 'V-Zoom Nitro Supercritical EVA' },
        { name: 'Upper Fabric', value: 'AeroWeave Monofilament Mesh' }
      ],
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop'
      ]
    },
    {
      _id: 'mock3',
      name: 'VX PowerFit Trainer Pro',
      brand: 'VelocityX',
      price: 140.00,
      discountPrice: 130.00,
      rating: 4.9,
      stockCount: 30,
      sku: 'TRN-POWERFIT-03',
      description: 'Built for the gym floor. Features a low-to-the-ground flat heel layout for maximum ground connection during deadlifts and squats, reinforced TPU lateral wraps for sideways containment, and a breathable mesh shield that stands up to rope climbs.',
      features: [
        'Low-to-the-ground flat lifting platform',
        'Reinforced dual-density TPU lateral wraps',
        'Sticky rubber compound cupsole grip',
        'Rope-resistant outer mesh guard'
      ],
      specifications: [
        { name: 'Heel-to-Toe Drop', value: '4 mm flat platform' },
        { name: 'Lateral Support', value: 'Dual-density TPU side wings' },
        { name: 'Outsole Grip', value: 'Sticky rubber compound cupsole' },
        { name: 'Collar Padding', value: 'Molded foam ankle grip' }
      ],
      images: [
        'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop'
      ]
    }
  ];
};

export default ProductDetails;
