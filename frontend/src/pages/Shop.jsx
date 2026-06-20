import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';
import { SkeletonCard } from '../components/common/Skeleton';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State filters
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Filter controllers
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');

  // Keep search inputs and category filters synced with URL parameters
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || '');
    setSort(searchParams.get('sort') || 'newest');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setRating(searchParams.get('rating') || '');
    setPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (category) queryParams.append('category', category);
        if (sort) queryParams.append('sort', sort);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (rating) queryParams.append('rating', rating);
        queryParams.append('page', page.toString());
        queryParams.append('limit', '8'); // 8 items per page

        const res = await api.get(`/api/products?${queryParams.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
          setPages(res.data.pages || 1);
        } else {
          setProducts(getMockShopProducts(category));
        }
      } catch (err) {
        console.error('Failed to load products', err);
        setProducts(getMockShopProducts(category));
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [search, category, sort, minPrice, maxPrice, rating, page]);

  const handleFilterChange = (key, value) => {
    const updated = new URLSearchParams(searchParams);
    if (value) {
      updated.set(key, value);
    } else {
      updated.delete(key);
    }
    updated.set('page', '1'); // reset page
    setSearchParams(updated);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setSearch('');
    setCategory('');
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setPage(1);
  };

  const handlePageChange = (num) => {
    const updated = new URLSearchParams(searchParams);
    updated.set('page', num.toString());
    setSearchParams(updated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoriesList = ['running', 'training', 'football', 'basketball', 'lifestyle', 'outdoor'];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-10 bg-dark text-white min-h-screen">
      
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-charcoal pb-6 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold font-display">VelocityX Gear</span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white font-display">Explore Collection</h1>
        </div>
        <div className="flex items-center space-x-4">
          
          {/* Toggle Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 border border-white/10 bg-charcoal py-2.5 px-4 rounded-xl text-xs uppercase tracking-widest font-semibold hover:border-primary hover:text-primary transition-all"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          {/* Sort Selector */}
          <select
            value={sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="border border-white/10 py-2.5 px-4 rounded-xl text-xs uppercase tracking-widest font-semibold outline-none bg-charcoal text-white hover:border-primary transition-all"
          >
            <option value="newest">Newest</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

        </div>
      </div>

      {/* 2. Search & Filtering Sidebar (Collapsible) */}
      {showFilters && (
        <div className="glass-card p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top duration-350 border border-white/10 text-white">
          
          {/* Keyword Search */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-primary font-display">Search Gear</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Product name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleFilterChange('search', e.target.value);
                }}
                className="w-full bg-dark border border-white/10 rounded-xl py-2.5 px-4 pr-10 text-xs font-light outline-none text-white focus:border-primary transition-all"
              />
              <Search size={14} className="absolute right-3.5 top-3.5 text-grey-medium" />
            </div>
          </div>

          {/* Category Filters */}
          <div className="space-y-2 col-span-1">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-orange font-display">Activity Category</label>
            <div className="flex flex-wrap gap-2">
              {categoriesList.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange('category', category === cat ? '' : cat)}
                  className={`py-1.5 px-3 rounded-lg text-[9px] uppercase tracking-widest transition-all ${
                    category === cat
                      ? 'bg-primary text-white font-bold'
                      : 'bg-dark border border-white/10 text-white font-medium hover:border-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filters */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-lime font-display">Price Range ($)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  handleFilterChange('minPrice', e.target.value);
                }}
                className="w-full bg-dark border border-white/10 rounded-xl py-2.5 px-3 text-xs outline-none text-white focus:border-primary transition-all"
              />
              <span className="text-grey-medium text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  handleFilterChange('maxPrice', e.target.value);
                }}
                className="w-full bg-dark border border-white/10 rounded-xl py-2.5 px-3 text-xs outline-none text-white focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Rating Filters & Reset */}
          <div className="space-y-2 flex flex-col justify-between">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-semibold text-primary font-display">Minimum Rating</label>
              <select
                value={rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full bg-dark border border-white/10 rounded-xl py-2.5 px-3 text-xs outline-none text-white focus:border-primary transition-all"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>
            
            <button
              onClick={handleResetFilters}
              className="mt-3 py-2.5 px-4 rounded-xl border border-dashed border-grey-medium text-grey-medium hover:border-white hover:text-white transition-all text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 bg-dark/40"
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          </div>

        </div>
      )}

      {/* 3. Products Grid Layout */}
      <div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-charcoal rounded-2xl space-y-4">
            <p className="text-sm text-grey-medium font-light">No products match your active search filters.</p>
            <button
              onClick={handleResetFilters}
              className="text-xs uppercase tracking-widest font-semibold bg-primary text-white py-3.5 px-8 rounded-xl hover:bg-orange transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* 4. Custom Pagination Controls */}
      {pages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-10 border-t border-charcoal">
          <button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className={`px-4 py-2 border rounded-xl text-xs uppercase tracking-widest font-semibold ${
              page === 1 ? 'border-charcoal text-neutral-600 cursor-not-allowed' : 'border-white/20 hover:bg-primary hover:text-white transition-colors'
            }`}
          >
            Prev
          </button>
          
          <div className="flex space-x-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`w-9 h-9 rounded-xl text-xs font-semibold ${
                  page === num ? 'bg-primary text-white' : 'border border-white/10 text-white hover:bg-charcoal transition-colors'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(Math.min(pages, page + 1))}
            disabled={page === pages}
            className={`px-4 py-2 border rounded-xl text-xs uppercase tracking-widest font-semibold ${
              page === pages ? 'border-charcoal text-neutral-600 cursor-not-allowed' : 'border-white/20 hover:bg-primary hover:text-white transition-colors'
            }`}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

// Mock fallback list aligned with sportswear seeds
const getMockShopProducts = (category) => {
  const all = [
    {
      _id: 'mock1',
      name: 'VelocityX ZoomFly V1',
      brand: 'VelocityX',
      price: 220.00,
      discountPrice: 195.00,
      rating: 4.8,
      stockCount: 25,
      categorySlug: 'running',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop'
      ]
    },
    {
      _id: 'mock2',
      name: 'AeroVelocity Windrunner Jacket',
      brand: 'VelocityX',
      price: 120.00,
      discountPrice: 0.00,
      rating: 4.6,
      stockCount: 40,
      categorySlug: 'running',
      images: [
        'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=800&auto=format&fit=crop'
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
      categorySlug: 'training',
      images: [
        'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop'
      ]
    },
    {
      _id: 'mock4',
      name: 'AeroDry Tech Compression Tee',
      brand: 'VelocityX',
      price: 45.00,
      discountPrice: 0.00,
      rating: 4.5,
      stockCount: 50,
      categorySlug: 'training',
      images: [
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop'
      ]
    },
    {
      _id: 'mock5',
      name: 'VelocityX Strike Cleats V3',
      brand: 'VelocityX',
      price: 260.00,
      discountPrice: 240.00,
      rating: 4.8,
      stockCount: 15,
      categorySlug: 'football',
      images: [
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800&auto=format&fit=crop'
      ]
    },
    {
      _id: 'mock6',
      name: 'VX Strike Training Tracksuit',
      brand: 'VelocityX',
      price: 130.00,
      discountPrice: 115.00,
      rating: 4.7,
      stockCount: 20,
      categorySlug: 'football',
      images: [
        'https://images.unsplash.com/photo-1486282446460-75746779ab47?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop'
      ]
    },
    {
      _id: 'mock7',
      name: 'VX HyperRise High-Tops',
      brand: 'VelocityX',
      price: 180.00,
      discountPrice: 0.00,
      rating: 4.7,
      stockCount: 18,
      categorySlug: 'basketball',
      images: [
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop'
      ]
    },
    {
      _id: 'mock8',
      name: 'VelocityX Baseline Mesh Shorts',
      brand: 'VelocityX',
      price: 40.00,
      discountPrice: 35.00,
      rating: 4.5,
      stockCount: 45,
      categorySlug: 'basketball',
      images: [
        'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1505666287802-931dc83948e9?q=80&w=800&auto=format&fit=crop'
      ]
    },
    {
      _id: 'mock9',
      name: 'VX Retro-Street Sneaker',
      brand: 'VelocityX',
      price: 135.00,
      discountPrice: 125.00,
      rating: 4.8,
      stockCount: 30,
      categorySlug: 'lifestyle',
      images: [
        'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop'
      ]
    },
    {
      _id: 'mock10',
      name: 'VelocityX Essential Hoodie',
      brand: 'VelocityX',
      price: 90.00,
      discountPrice: 0.00,
      rating: 4.6,
      stockCount: 25,
      categorySlug: 'lifestyle',
      images: [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'
      ]
    },
    {
      _id: 'mock11',
      name: 'VX TrailGrip Waterproof Boot',
      brand: 'VelocityX',
      price: 190.00,
      discountPrice: 175.00,
      rating: 4.9,
      stockCount: 16,
      categorySlug: 'outdoor',
      images: [
        'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop'
      ]
    },
    {
      _id: 'mock12',
      name: 'VX Zenith Storm-Shell Parka',
      brand: 'VelocityX',
      price: 280.00,
      discountPrice: 260.00,
      rating: 4.9,
      stockCount: 12,
      categorySlug: 'outdoor',
      images: [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?q=80&w=800&auto=format&fit=crop'
      ]
    }
  ];

  if (category) {
    return all.filter(p => p.categorySlug === category);
  }
  return all;
};

export default Shop;
