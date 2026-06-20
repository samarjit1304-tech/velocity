import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, User, ArrowRight, X, ChevronRight } from 'lucide-react';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);

  const categories = ['all', 'training', 'running', 'nutrition', 'recovery', 'athlete stories', 'sports science'];

  const blogPosts = [
    {
      id: 1,
      title: "The Science of Carbon Plates: How ZoomFly V1 Saves 4% Energy",
      excerpt: "Material scientists dissect the biomechanics of curved carbon-fiber chassis and supercritical nitro foams under marathon velocity loads.",
      content: `Curved carbon-fiber plates are transforming marathon statistics. By sandwiching a rigid, S-curved carbon-composite plate between supercritical Nitrogen-infused foam layers, the VelocityX ZoomFly V1 behaves like a biomechanical leaf-spring. 

Instead of flexing under your foot and absorbing kinetic energy, the rigid plate minimizes metatarsophalangeal joint flexion. The results are clear: oxygen consumption is reduced by approximately 4%, allowing athletes to maintain peak aerobic speed for longer duration. In this article, our laboratory technicians break down footstrike forces and rebound coefficients.`,
      category: "sports science",
      image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop",
      date: "June 14, 2026",
      readTime: "6 min read",
      author: "Dr. Rachel Thorne (Ph.D Biomechanics)",
      tags: ["Carbon Plate", "Marathon Tech", "V-Zoom Nitro"]
    },
    {
      id: 2,
      title: "Active Recovery vs Cryotherapy: The Biomechanical Review",
      excerpt: "Should you hop in the ice bath or pull on the compression leggings? We look at raw recovery metrics from elite training regimes.",
      content: `For decades, dropping into sub-50°F cold water was the gold standard for post-workout muscle soreness. Today, sports scientists advocate for a hybrid model. Cryotherapy constricts blood vessels, effectively shutting down inflammatory swelling. However, chronic ice bathing can blunt muscular hypertrophy signals.

To counter this, active recovery—such as low-intensity compression cycling and static stretching—promotes arterial blood circulation, sweeping cellular debris from tissue without interrupting fiber repair. Here is how to construct a weekly recovery schedule based on your heart-rate training zones.`,
      category: "recovery",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
      date: "June 10, 2026",
      readTime: "5 min read",
      author: "Coach Alex Rivera",
      tags: ["Cryotherapy", "Muscle Repair", "Active Recovery"]
    },
    {
      id: 3,
      title: "Carbohydrate Loading: The 90g Per Hour Elite Rule",
      excerpt: "Modern endurance fueling is shifting. Learn how to train your stomach to absorb maximum carbohydrates without gastric distress.",
      content: `The days of sipping simple water during a 20-mile run are gone. Elite sports nutritionists now prescribe up to 90-120 grams of carbohydrates per hour of heavy exertion. This is achieved by combining dual-source carbs (maltodextrin to fructose in a 1:0.8 ratio) to utilize multiple intestinal transporters simultaneously.

Learn how to periodize your carbohydrate intake leading up to race day, structure your pre-race breakfast, and train your gut to process energy gels under high vertical heart rate thresholds.`,
      category: "nutrition",
      image: "https://images.unsplash.com/photo-1505666287802-931dc83948e9?q=80&w=800&auto=format&fit=crop",
      date: "May 28, 2026",
      readTime: "8 min read",
      author: "Sarah Jenkins (RD, Performance Nutritionist)",
      tags: ["Carb Loading", "Endurance Fueling", "Intestinal Transporters"]
    },
    {
      id: 4,
      title: "Building Lateral Containment for Quick Agility Cuts",
      excerpt: "Lifting weights isn't enough. We document training routines targeting structural ankle support and rapid side-to-side acceleration.",
      content: `Linear power is useless on the pitch if you slide when turning. Dynamic agility cuts require exceptional eccentric leg strength and stable foot containment. Our training guides show you how to condition your peroneals, gluteus medius, and tibialis posterior.

Pair these workouts with the dual-density lateral TPU side wings found in our VX PowerFit Trainers to lock in your heel and eliminate shoe rollover.`,
      category: "training",
      image: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop",
      date: "May 15, 2026",
      readTime: "4 min read",
      author: "Marcus Carter (Elite Trainer)",
      tags: ["Agility Drills", "Lateral Strength", "Ankle Stabilization"]
    },
    {
      id: 5,
      title: "Spotlight: Marcus Carter on Qualifying for Boston",
      excerpt: "Underdog athlete breaks the 2:40 barrier wearing ZoomFly V1. Read his mental strategy and training log.",
      content: `When Marcus Carter lined up at the Chicago Marathon, his personal best was 2:54. Three hours later, he crossed the line in 2:38:12. In this athlete spotlight, Marcus details the mental walls he broke at mile 20, his 70-mile peak training weeks, and why footwear cushioning made all the difference in the final 10K.

"In previous marathons, my calves would seize up at mile 18. The V-Zoom Nitro foam preserved my muscle tissue so well that I could actually launch a negative split in the final stages," Marcus explains.`,
      category: "athlete stories",
      image: "https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=800&auto=format&fit=crop",
      date: "May 02, 2026",
      readTime: "10 min read",
      author: "VelocityX Editorial Staff",
      tags: ["Marathon Runner", "Athlete Spotlight", "Boston Qualifier"]
    },
    {
      id: 6,
      title: "Traction Mechanics: How Stud Layouts Alter Turf Velocity",
      excerpt: "Pitch analytics reveal how stud geometries control linear torque and rotational knee shear on wet soils.",
      content: `The geometry of your boot plate determines your acceleration profile. Circular studs allow fluid pivot rotations, lowering rotational knee strain but sacrificing grip. Chevron blade shapes, however, bite deep into firm soil, releasing immediate linear torque.

VelocityX Strike Cleats V3 balance this by utilizing asymmetric bladed chevron studs on the toe and hollow circular studs on the pivot point, giving soccer players explosive takeoff and safe cut mechanics.`,
      category: "running",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
      date: "April 20, 2026",
      readTime: "7 min read",
      author: "Prof. Derek Vance (Sports Science Center)",
      tags: ["Stud Geometry", "Turf Torque", "Knee Biomechanics"]
    }
  ];

  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-12 bg-dark text-white min-h-screen">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.4em] text-primary font-bold font-display">VelocityX Journal</span>
        <h1 className="text-4xl md:text-5xl font-black uppercase font-display tracking-tight text-white leading-none">
          THE PERFORMANCE <br />
          <span className="text-gradient-orange-red italic">JOURNAL.</span>
        </h1>
        <p className="text-xs md:text-sm text-grey-light font-light max-w-xl mx-auto">
          Explore sports science, active nutrition, athlete profiles, and materials engineering written by professional coaches and biomechanics experts.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-charcoal pb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`py-2 px-4 rounded-xl text-xs uppercase tracking-widest transition-all font-semibold ${
              selectedCategory === cat
                ? 'bg-primary text-white shadow-premium font-bold'
                : 'bg-charcoal border border-white/5 text-grey-light hover:border-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className="bg-charcoal rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-between hover:border-primary/50 transition-all duration-300 group shadow-md"
          >
            <div>
              {/* Image with zoom on hover */}
              <div className="aspect-[16/10] overflow-hidden bg-dark">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
              </div>

              {/* Content area */}
              <div className="p-6 space-y-3">
                <div className="flex items-center space-x-3 text-[10px] text-grey-medium uppercase tracking-wider font-bold">
                  <span className="text-primary font-bold">{post.category}</span>
                  <span>&bull;</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-white font-display leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-grey-light font-light leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex justify-between items-center border-t border-white/5 mt-4">
              <span className="text-[10px] text-grey-medium font-light">{post.date}</span>
              <button
                onClick={() => setSelectedPost(post)}
                className="text-primary hover:text-white text-xs uppercase tracking-wider font-bold flex items-center space-x-1 group/btn"
              >
                <span>Read Full</span>
                <ChevronRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FULL POST EXPANDER MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-charcoal max-w-2xl w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative flex flex-col max-h-[85vh]">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 bg-dark/70 hover:bg-dark text-white rounded-full p-2 border border-white/10 transition-colors z-10"
              aria-label="Close article"
            >
              <X size={16} />
            </button>

            {/* Scrollable container */}
            <div className="overflow-y-auto flex-1 scrollbar-thin">
              <div className="aspect-[16/9] w-full bg-dark overflow-hidden relative">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
                <span className="absolute bottom-4 left-6 bg-primary text-white text-[9px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full">
                  {selectedPost.category}
                </span>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-black uppercase text-white font-display leading-tight">
                    {selectedPost.title}
                  </h2>
                  
                  {/* Meta items */}
                  <div className="flex flex-wrap gap-4 text-[10px] text-grey-medium font-bold uppercase tracking-wider pt-1 border-b border-white/5 pb-4">
                    <div className="flex items-center space-x-1">
                      <User size={12} className="text-primary" />
                      <span>{selectedPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} className="text-orange" />
                      <span>{selectedPost.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={12} className="text-lime" />
                      <span>{selectedPost.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Content body */}
                <div className="text-xs text-grey-light font-light leading-relaxed space-y-4 whitespace-pre-line">
                  {selectedPost.content}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {selectedPost.tags.map(t => (
                    <span key={t} className="bg-dark text-grey-light text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-white/5">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="bg-dark px-6 py-4 flex justify-end border-t border-white/5">
              <button
                onClick={() => setSelectedPost(null)}
                className="bg-primary hover:bg-orange text-white text-xs uppercase tracking-widest font-bold py-2.5 px-6 rounded-xl transition-all"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Blog;
