import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Leaf, Flame, Trophy, Cpu, Zap, Activity } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';
import { SkeletonCard } from '../components/common/Skeleton';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCollectionTab, setActiveCollectionTab] = useState('all');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await api.get('/api/products?limit=12');
        if (response.data.success && response.data.products.length > 0) {
          const prods = response.data.products;
          setFeaturedProducts(prods.slice(0, 4));
          setBestSellers(prods.slice(4, 8));
          setNewArrivals(prods.slice(8, 12));
        } else {
          const mockData = getMockHomeProducts();
          setFeaturedProducts(mockData.slice(0, 4));
          setBestSellers(mockData.slice(4, 8));
          setNewArrivals(mockData.slice(8, 12));
        }
      } catch (err) {
        console.error('Failed to fetch catalog', err);
        const mockData = getMockHomeProducts();
        setFeaturedProducts(mockData.slice(0, 4));
        setBestSellers(mockData.slice(4, 8));
        setNewArrivals(mockData.slice(8, 12));
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const categories = [
    { name: 'Running', slug: 'running', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop', slogan: 'Speed & Efficiency' },
    { name: 'Training', slug: 'training', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop', slogan: 'Strength & Power' },
    { name: 'Football', slug: 'football', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop', slogan: 'Precision & Control' },
    { name: 'Basketball', slug: 'basketball', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop', slogan: 'Explosive Vertical' },
    { name: 'Lifestyle', slug: 'lifestyle', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop', slogan: 'Street & Comfort' },
    { name: 'Outdoor', slug: 'outdoor', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop', slogan: 'All-Weather Protection' }
  ];

  const testimonials = [
    { quote: "The ZoomFly V1 completely changed my marathon pace. The cushioning and energy return are next-level.", author: "Marcus Jenkins", title: "Boston Qualifier" },
    { quote: "VelocityX training gear withstands my toughest functional workouts. Highly recommend the flat lifting trainers.", author: "Elena Rostova", title: "CrossFit Coach" },
    { quote: "Cleats gave me unbelievable traction and control on the wet turf today. A true game-changer.", author: "David Vance", title: "Semi-Pro Winger" }
  ];

  const filteredFeatured = activeCollectionTab === 'all' 
    ? featuredProducts 
    : featuredProducts.filter(p => p.category?.name?.toLowerCase() === activeCollectionTab || p.tags?.includes(activeCollectionTab));

  return (
    <div className="space-y-28 bg-dark pb-16">
      {/* 1. Hero Section */}
      <section className="relative h-[95vh] min-h-[650px] flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=1920&auto=format&fit=crop"
            alt="VelocityX athlete performance"
            className="w-full h-full object-cover opacity-50 transition-all duration-[12s] scale-105 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center space-y-6 z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-2 bg-primary/20 border border-primary/30 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest text-lime font-semibold"
          >
            <Zap size={12} className="animate-pulse" />
            <span>Introducing ZoomFly V1</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none uppercase font-display"
          >
            MOVE BEYOND <br />
            <span className="text-gradient-blue-orange italic">LIMITS.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm md:text-lg text-grey-light max-w-xl font-light font-sans"
          >
            Engineered for champions. Designed for everyone. Experience professional-grade sportswear crafted for raw power and movement.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4"
          >
            <Link
              to="/shop"
              className="btn-velocity text-white text-xs py-4 px-10 rounded-xl flex items-center group font-bold shadow-lg shadow-primary/25"
            >
              <span>Shop Collection</span>
              <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="btn-velocity-outline text-white text-xs py-4 px-10 rounded-xl font-bold transition-all"
            >
              Our Philosophy
            </Link>
          </motion.div>
        </div>
        
        {/* Decorative dynamic diagonal mesh */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-dark translate-y-12 skew-y-3 origin-bottom-left" />
      </section>

      {/* 2. Shop By Sport (Featured Collections) */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold font-display">Performance Lines</span>
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-white">Shop By Category</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              whileHover={{ y: -6 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden group shadow-hover border border-white/5 bg-charcoal"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/40 to-transparent" />
              
              <div className="absolute inset-x-6 bottom-6 flex justify-between items-end text-white">
                <div>
                  <span className="text-[10px] text-orange uppercase tracking-wider font-bold">{cat.slogan}</span>
                  <h3 className="text-lg font-black uppercase tracking-wider font-display">{cat.name}</h3>
                </div>
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="bg-primary text-white rounded-full p-3 shadow-premium hover:bg-orange transition-all duration-300"
                >
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Slider */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between border-b border-charcoal pb-4 gap-2">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-orange font-bold font-display">Fresh Drops</span>
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white">New Arrivals</h2>
          </div>
          <Link to="/shop?sort=newest" className="text-xs uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center font-bold">
            <span>View All Drop</span>
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? [1, 2, 3, 4].map(n => <SkeletonCard key={n} />)
            : newArrivals.map(prod => <ProductCard key={prod._id} product={prod} />)}
        </div>
      </section>

      {/* 4. Athlete Spotlight (Storytelling) */}
      <section className="bg-charcoal py-24 relative overflow-hidden">
        {/* Background diagonal stripe for motion */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent skew-x-12 translate-x-12" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-lime font-bold font-display flex items-center gap-1.5">
              <Activity size={14} />
              Athlete Spotlight
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
              PUSH PAST <br />
              <span className="text-gradient-orange-red italic">YOUR LIMITS.</span>
            </h2>
            <p className="text-sm text-grey-light font-light leading-relaxed">
              We design our gear alongside professional athletes and elite training coaches. From the traction lugs on our trail runners to the moisture extraction technology in our training tees, every thread is put through high-intensity tests before it reaches you.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-1">
                <Trophy size={22} className="text-orange animate-bounce" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Championship Build</h4>
                <p className="text-[10px] text-grey-medium font-light">Developed and tested on professional pitches.</p>
              </div>
              <div className="space-y-1">
                <Cpu size={22} className="text-primary" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">V-Engineered Tech</h4>
                <p className="text-[10px] text-grey-medium font-light">Incorporating carbon plates and reactive foam.</p>
              </div>
            </div>
            <div className="pt-2">
              <Link to="/blog" className="inline-flex items-center text-xs uppercase tracking-widest font-bold border-b border-primary pb-1 hover:text-white hover:border-white transition-all text-primary">
                Explore Athlete Stories
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-12 gap-4">
            <div className="col-span-7">
              <img
                src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop"
                alt="Marathon athlete runner"
                className="w-full h-full object-cover rounded-2xl aspect-square shadow-premium border border-white/5 hover:scale-105 transition-all duration-700"
              />
            </div>
            <div className="col-span-5 flex flex-col justify-between h-full space-y-4">
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop"
                alt="Training athlete lifting"
                className="w-full object-cover rounded-2xl aspect-[4/5] shadow-premium border border-white/5 hover:scale-105 transition-all duration-700"
              />
              <img
                src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop"
                alt="Basketball court play"
                className="w-full object-cover rounded-2xl aspect-[4/3] shadow-premium border border-white/5 hover:scale-105 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between border-b border-charcoal pb-4 gap-2">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-bold font-display">Championship Favorites</span>
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white">Best Sellers</h2>
          </div>
          <Link to="/shop?sort=rating" className="text-xs uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center font-bold">
            <span>View All Popular</span>
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? [1, 2, 3, 4].map(n => <SkeletonCard key={n} />)
            : bestSellers.map(prod => <ProductCard key={prod._id} product={prod} />)}
        </div>
      </section>

      {/* 6. Sustainability Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 bg-charcoal rounded-3xl p-8 md:p-12 border border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-lime font-bold font-display flex items-center gap-1.5">
            <Leaf size={14} />
            Circular Performance
          </span>
          <h2 className="text-2xl md:text-4xl font-black uppercase text-white leading-tight">
            SUSTAINABILITY IN <br />
            EVERY THREAD
          </h2>
          <p className="text-xs text-grey-light font-light leading-relaxed">
            Performance gear shouldn't cost the Earth. We spin our technical fabrics using certified ocean plastics and organic cottons. Our carbon footprint is fully trace-disclosed, and 100% of our domestic deliveries are carbon-offset.
          </p>
          <div className="pt-2">
            <Link to="/about?section=sustainability" className="btn-velocity-outline text-white text-[10px] py-3 px-6 rounded-lg font-bold">
              Read Our Pledge
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          <div className="glass-card p-6 rounded-2xl text-center space-y-2">
            <h3 className="text-3xl font-extrabold text-lime">84%</h3>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recycled Yarn</h4>
            <p className="text-[10px] text-grey-medium font-light">Of our activewear shirts are spun from recycled ocean plastics.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center space-y-2">
            <h3 className="text-3xl font-extrabold text-primary">0%</h3>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Virgin Polyester</h4>
            <p className="text-[10px] text-grey-medium font-light">Goal to replace all virgin oil polymers in our footwear by 2027.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center space-y-2 col-span-2">
            <h3 className="text-3xl font-extrabold text-orange">100%</h3>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Offset Footprint</h4>
            <p className="text-[10px] text-grey-medium font-light">Every production and shipping operation is carbon-balanced with planting reserves.</p>
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="max-w-5xl mx-auto px-6 text-center space-y-12">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-grey-medium font-bold font-display">Verified Athletes</span>
          <h2 className="text-2xl md:text-3xl font-black uppercase text-white">Proven On The Ground</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-charcoal/80 p-8 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between hover:border-primary/50 transition-all duration-300">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={12} fill="#FF5A00" stroke="#FF5A00" />
                ))}
              </div>
              <p className="text-xs text-grey-light font-light leading-relaxed flex-grow italic">
                "{t.quote}"
              </p>
              <div className="pt-2 border-t border-white/5">
                <h4 className="text-xs font-bold tracking-wider text-white">{t.author}</h4>
                <p className="text-[9px] text-grey-medium font-light uppercase tracking-widest">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Call To Action Banner */}
      <section className="bg-gradient-to-r from-primary to-orange py-16 rounded-3xl max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-primary/10">
        <div className="space-y-2 text-white">
          <h3 className="text-2xl md:text-3xl font-black uppercase leading-none">WANT EXCLUSIVE DROP ACCESS?</h3>
          <p className="text-xs text-white/80 font-light max-w-md">Join the VelocityX team today. Members receive early drop coordinates, special workout logs, and custom discounts.</p>
        </div>
        <div className="flex space-x-4 shrink-0">
          <Link
            to="/register"
            className="bg-white hover:bg-lime text-dark text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-xl transition-all shadow-premium"
          >
            Create Free Account
          </Link>
          <Link
            to="/shop"
            className="border border-white text-white text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-dark transition-all"
          >
            Explore Gear
          </Link>
        </div>
      </section>
    </div>
  );
};

// Fallback mock items helper aligned with sportswear seeds
const getMockHomeProducts = () => {
  return [
    {
      _id: 'mock1',
      name: 'VelocityX ZoomFly V1',
      brand: 'VelocityX',
      price: 220.00,
      discountPrice: 195.00,
      rating: 4.8,
      stockCount: 10,
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
      stockCount: 20,
      images: [
        'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop'
      ]
    },
    {
      _id: 'mock4',
      name: 'VelocityX Strike Cleats V3',
      brand: 'VelocityX',
      price: 260.00,
      discountPrice: 240.00,
      rating: 4.8,
      stockCount: 8,
      images: [
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800&auto=format&fit=crop'
      ]
    },
    {
      _id: 'mock5',
      name: 'VX HyperRise High-Tops',
      brand: 'VelocityX',
      price: 180.00,
      discountPrice: 0.00,
      rating: 4.7,
      stockCount: 25,
      images: [
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop'
      ]
    },
    {
      _id: 'mock6',
      name: 'VX TrailGrip Waterproof Boot',
      brand: 'VelocityX',
      price: 190.00,
      discountPrice: 175.00,
      rating: 4.9,
      stockCount: 15,
      images: [
        'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop'
      ]
    },
    {
      _id: 'mock7',
      name: 'VX Zenith Storm-Shell Parka',
      brand: 'VelocityX',
      price: 280.00,
      discountPrice: 260.00,
      rating: 4.9,
      stockCount: 12,
      images: [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?q=80&w=800&auto=format&fit=crop'
      ]
    },
    {
      _id: 'mock8',
      name: 'AeroDry Tech Compression Tee',
      brand: 'VelocityX',
      price: 45.00,
      discountPrice: 0.00,
      rating: 4.5,
      stockCount: 40,
      images: [
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop'
      ]
    }
  ];
};

export default Home;
