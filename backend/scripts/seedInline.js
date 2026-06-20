const mongoose = require('mongoose');

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const Payment = require('../models/Payment');
const AuditLog = require('../models/AuditLog');

const categoriesData = [
  {
    name: 'Running',
    description: 'High-performance footwear and apparel engineered for ultimate speed, efficiency, and comfort on the road or track.',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Training',
    description: 'Versatile, breathable gear built to withstand high-intensity workouts, weight sessions, and agility training.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Football',
    description: 'Elite pitch control. Lightweight cleats and apparel engineered for maximum traction, agility, and precision strikes.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Basketball',
    description: 'High-top cushioning, traction, and ankle support designed for explosive vertical jumps, quick cuts, and court control.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Lifestyle',
    description: 'Sleek, sport-inspired silhouettes and elevated sportswear tailored for modern street culture and daily comfort.',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Outdoor',
    description: 'All-weather protection. Rugged trail footwear and technical outerwear built to endure the elements.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop'
  }
];

const seedDataInline = async () => {
  try {
    console.log('Clearing old collections for inline seed...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});
    await Payment.deleteMany({});
    await AuditLog.deleteMany({});

    console.log('Creating Seed Users...');
    const adminUser = await User.create({
      name: 'VelocityX Admin',
      email: 'admin@velocityx.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });

    const regularUser1 = await User.create({
      name: 'Marcus Carter',
      email: 'user@velocityx.com',
      password: 'user123',
      role: 'user',
      isVerified: true,
      addresses: [
        {
          street: '45 Speed Way, Penthouse C',
          city: 'Boston',
          state: 'MA',
          postalCode: '02108',
          country: 'United States',
          isDefault: true
        }
      ]
    });

    const regularUser2 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@velocityx.com',
      password: 'user123',
      role: 'user',
      isVerified: true
    });

    console.log('Creating Categories...');
    const categoriesMap = {};
    for (const cat of categoriesData) {
      const createdCat = await Category.create(cat);
      categoriesMap[cat.name] = createdCat._id;
    }

    console.log('Creating 12 Sportswear and Footwear Products...');

    const productsData = [
      {
        name: 'VelocityX ZoomFly V1',
        shortDescription: 'Elite carbon-plated running shoes engineered for marathon speed.',
        description: 'Take your runs to the limit. The VelocityX ZoomFly V1 incorporates a rigid curved carbon-fiber plate sandwiched within reactive V-Zoom Nitro foam, returning energy with every stride. The upper features engineered AeroWeave mesh for targeted breathability and support.',
        price: 220.00,
        discountPrice: 195.00,
        sku: 'RUN-ZOOMFLY-01',
        brand: 'VelocityX',
        category: categoriesMap['Running'],
        stockCount: 25,
        tags: ['running', 'shoes', 'marathon', 'cushioned', 'carbon-plate'],
        shippingInfo: 'Complimentary expedited carbon-neutral shipping. Transit 2-3 business days.',
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
        name: 'AeroVelocity Windrunner Jacket',
        shortDescription: 'Ultra-lightweight windproof and water-resistant technical running shell.',
        description: 'Engineered for running in unstable conditions. Fabricated from 100% recycled ripstop polyester with a durable water-repellent coating. Features back ventilation slots, reflective details for night visibility, and packs down fully into its own chest pocket.',
        price: 120.00,
        discountPrice: 0.00,
        sku: 'RUN-WIND-02',
        brand: 'VelocityX',
        category: categoriesMap['Running'],
        stockCount: 40,
        tags: ['running', 'apparel', 'outerwear', 'windproof', 'water-resistant'],
        shippingInfo: 'Complimentary carbon-neutral courier shipping. Standard transit 3-5 days.',
        specifications: [
          { name: 'Material Composition', value: '100% Recycled Ripstop Polyester' },
          { name: 'Waterproof Treatment', value: 'PFC-Free DWR Coating' },
          { name: 'Packability', value: 'Stows fully in chest pocket' },
          { name: 'Reflective Hits', value: '360° reflectivity tape' }
        ],
        images: [
          'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=800&auto=format&fit=crop'
        ]
      },
      {
        name: 'VX PowerFit Trainer Pro',
        shortDescription: 'High-stability cross-training shoe for lifting and functional workouts.',
        description: 'Built for the gym floor. Features a low-to-the-ground flat heel layout for maximum ground connection during deadlifts and squats, reinforced TPU lateral wraps for sideways containment, and a breathable mesh shield that stands up to rope climbs.',
        price: 140.00,
        discountPrice: 130.00,
        sku: 'TRN-POWERFIT-03',
        brand: 'VelocityX',
        category: categoriesMap['Training'],
        stockCount: 30,
        tags: ['training', 'shoes', 'gym', 'stability', 'crossfit'],
        shippingInfo: 'Complimentary courier shipping. Standard transit 3-5 business days.',
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
      },
      {
        name: 'AeroDry Tech Compression Tee',
        shortDescription: 'Zero-chafing compression shirt with high sweat dispersion.',
        description: 'Locks in muscle vibration and wicks moisture during heavy performance workouts. Made of a recycled nylon knit that lowers skin temperature, combined with flat-locked ergonomic seams and anti-microbial odor control.',
        price: 45.00,
        discountPrice: 0.00,
        sku: 'TRN-COMPTEE-04',
        brand: 'VelocityX',
        category: categoriesMap['Training'],
        stockCount: 50,
        tags: ['training', 'apparel', 'compression', 'dryfit', 'gym'],
        shippingInfo: 'Standard transit 3-5 days.',
        specifications: [
          { name: 'Fabric Blend', value: '84% Recycled Nylon, 16% Elastane' },
          { name: 'Moisture Technology', value: 'AeroDry micro-groove capillary pull' },
          { name: 'Weight Class', value: 'Ultra-light 120 gsm' },
          { name: 'Odor Control', value: 'Natural Silver-Ion treatment' }
        ],
        images: [
          'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop'
        ]
      },
      {
        name: 'VelocityX Strike Cleats V3',
        shortDescription: 'Professional firm-ground football cleats built for striking precision.',
        description: 'Command the pitch. Incorporates a high-tension carbon-composite outsole plate for immediate liftoff acceleration, coupled with a sticky rubber GripSkin texturized upper panel to guide control and curl on the football.',
        price: 260.00,
        discountPrice: 240.00,
        sku: 'FTB-STRIKE-05',
        brand: 'VelocityX',
        category: categoriesMap['Football'],
        stockCount: 15,
        tags: ['football', 'shoes', 'cleats', 'professional', 'traction'],
        shippingInfo: 'DHL Express priority shipping. Transit 2 business days.',
        specifications: [
          { name: 'Soleplate Base', value: 'T700 Carbon Fiber Chassis' },
          { name: 'Stud Layout', value: 'Bladed chevron studs for acceleration' },
          { name: 'Upper Coating', value: 'Velocity GripSkin polymer coating' },
          { name: 'Lacing Layout', value: 'Off-center asymmetric lacing' }
        ],
        images: [
          'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800&auto=format&fit=crop'
        ]
      },
      {
        name: 'VX Strike Training Tracksuit',
        shortDescription: 'Tapered streamlined warmup tracksuit with performance ventilation.',
        description: 'Engineered for dynamic football warmups. The set includes a quarter-zip technical pullover and slim-fit training pants. Fabricated from dry-knit polyester with breathable laser-perforated back panels and ankle zippers for fast transitions over cleats.',
        price: 130.00,
        discountPrice: 115.00,
        sku: 'FTB-SUIT-06',
        brand: 'VelocityX',
        category: categoriesMap['Football'],
        stockCount: 20,
        tags: ['football', 'apparel', 'tracksuit', 'warmup', 'training'],
        shippingInfo: 'Complimentary courier shipping. Standard transit 3-5 days.',
        specifications: [
          { name: 'Fit Silhouette', value: 'Athletic tapered contour' },
          { name: 'Zippers', value: 'Ankle-opening locking YKK zippers' },
          { name: 'Ventilation', value: 'Laser-cut back map exhaust' },
          { name: 'Fabrication', value: '92% Performance Polyester, 8% Lycra' }
        ],
        images: [
          'https://images.unsplash.com/photo-1486282446460-75746779ab47?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop'
        ]
      },
      {
        name: 'VX HyperRise High-Tops',
        shortDescription: 'Elite cushioned high-top basketball shoes for explosive players.',
        description: 'Dominate the air. Built with dual-chamber pressurized air capsules under the heel and forefoot for high-altitude spring, a high-top collar to wrap the ankle in plush containment, and a rubber herringbone tread for quick cuts and stop-and-go traction.',
        price: 180.00,
        discountPrice: 0.00,
        sku: 'BKB-HYPERRISE-07',
        brand: 'VelocityX',
        category: categoriesMap['Basketball'],
        stockCount: 18,
        tags: ['basketball', 'shoes', 'hightop', 'cushioned', 'vertical'],
        shippingInfo: 'Complimentary carbon-neutral courier shipping. Standard transit 3-5 days.',
        specifications: [
          { name: 'Collar Style', value: 'Molded high-top with ankle strap' },
          { name: 'Cushioning Pods', value: 'Dual-chamber pressurized Air Pods' },
          { name: 'Traction Pattern', value: 'Full-court rubber herringbone' },
          { name: 'Weight', value: '410 grams' }
        ],
        images: [
          'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop'
        ]
      },
      {
        name: 'VelocityX Baseline Mesh Shorts',
        shortDescription: 'Lightweight double-layered mesh shorts for on-court performance.',
        description: 'Made for active scrimmages and high jump drills. Engineered with an outer performance mesh layer for max airflow and a silky anti-chafe compression inner liner. Completed with a thick anti-slip jacquard drawstring waistband.',
        price: 40.00,
        discountPrice: 35.00,
        sku: 'BKB-SHORTS-08',
        brand: 'VelocityX',
        category: categoriesMap['Basketball'],
        stockCount: 45,
        tags: ['basketball', 'apparel', 'shorts', 'breathable', 'training'],
        shippingInfo: 'Standard transit 3-5 business days.',
        specifications: [
          { name: 'Inseam length', value: '9 inches' },
          { name: 'Inner Lining', value: 'Silky spandex friction-free layer' },
          { name: 'Pocket Security', value: 'Side zipper pockets' },
          { name: 'Waistband', value: 'Elastic weave with external drawstrings' }
        ],
        images: [
          'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1505666287802-931dc83948e9?q=80&w=800&auto=format&fit=crop'
        ]
      },
      {
        name: 'VX Retro-Street Sneaker',
        shortDescription: 'Elevated suede and full-grain leather lifestyle sneakers.',
        description: 'Classic court lines merged with contemporary streetwear aesthetics. Handmade using fine Italian split suede and full-grain leather overlays. Sits on a recycled rubber cupsole and incorporates an Ortholite performance memory-foam insole for daily comfort.',
        price: 135.00,
        discountPrice: 125.00,
        sku: 'LFT-RETROSNEAK-09',
        brand: 'VelocityX',
        category: categoriesMap['Lifestyle'],
        stockCount: 30,
        tags: ['lifestyle', 'shoes', 'sneakers', 'streetwear', 'premium'],
        shippingInfo: 'Complimentary shipping. Standard transit 3-5 days.',
        specifications: [
          { name: 'Outer Materials', value: 'Italian Split Suede & Full-Grain Leather' },
          { name: 'Insole Tech', value: 'Ortholite Eco-Plush memory foam' },
          { name: 'Build Location', value: 'Handcrafted in Porto, Portugal' },
          { name: 'Outsole Material', value: '30% Recycled vulcanized rubber' }
        ],
        images: [
          'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop'
        ]
      },
      {
        name: 'VelocityX Essential Hoodie',
        shortDescription: 'Heavyweight organic cotton French Terry hoodie with minimalist logo.',
        description: 'Ultimate daily comfort. Spun from 450 GSM ultra-dense organic French Terry cotton. Designed with dropped shoulders, double-layered hood without drawstrings, and a clean minimalist heat-pressed VelocityX logo on the sleeve.',
        price: 90.00,
        discountPrice: 0.00,
        sku: 'LFT-HOODIE-10',
        brand: 'VelocityX',
        category: categoriesMap['Lifestyle'],
        stockCount: 25,
        tags: ['lifestyle', 'apparel', 'hoodie', 'streetwear', 'cotton'],
        shippingInfo: 'Complimentary courier shipping. Standard transit 3-5 days.',
        specifications: [
          { name: 'Fabric Weight', value: '450 GSM Heavyweight' },
          { name: 'Material Structure', value: '100% Organic French Terry Cotton' },
          { name: 'Fit Style', value: 'Relaxed drop-shoulder silhouette' },
          { name: 'Pocket Detail', value: 'Kangaroo pouch with hidden internal zip pocket' }
        ],
        images: [
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'
        ]
      },
      {
        name: 'VX TrailGrip Waterproof Boot',
        shortDescription: 'All-weather trail and hiking boot with high-traction Vibram sole.',
        description: 'Conquer any terrain. Built with a fully seam-sealed waterproof lining, heavy-duty abrasion panels, and a high-performance Vibram Megagrip lug outsole that grabs slick rocks and mud. Features a compressed EVA midsole to absorb trail shocks.',
        price: 190.00,
        discountPrice: 175.00,
        sku: 'OUT-TRAILGRIP-11',
        brand: 'VelocityX',
        category: categoriesMap['Outdoor'],
        stockCount: 16,
        tags: ['outdoor', 'shoes', 'trail', 'waterproof', 'hiking'],
        shippingInfo: 'Complimentary fragile handling shipping. Standard transit 3-5 days.',
        specifications: [
          { name: 'Waterproof Membrane', value: 'SympaTex Seam-Sealed Protection' },
          { name: 'Outsole Lug Depth', value: '5mm Vibram Megagrip Lugs' },
          { name: 'Toe Wrap', value: 'Reinforced heavy rubber toe guard' },
          { name: 'Weight', value: '460 grams (size 9)' }
        ],
        images: [
          'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop'
        ]
      },
      {
        _id: new mongoose.Types.ObjectId('60d5ec49f83f2a2408c4e402'),
        name: 'VX Zenith Storm-Shell Parka',
        shortDescription: 'Premium triple-layer technical mountain jacket built for extreme weather.',
        description: 'The ultimate protection from mountain elements. Formed with a 3-layer laminated fabric system that is completely windproof and waterproof (20,000mm hydrostatic head) yet extremely breathable. Features fully taped seams, YKK water-tight zips, and underarm vents.',
        price: 280.00,
        discountPrice: 260.00,
        sku: 'OUT-ZENITH-12',
        brand: 'VelocityX',
        category: categoriesMap['Outdoor'],
        stockCount: 12,
        tags: ['outdoor', 'apparel', 'jacket', 'waterproof', 'winter'],
        shippingInfo: 'Complimentary priority DHL express shipping. Transit 2 days.',
        specifications: [
          { name: 'Shell Class', value: '3-Layer laminated breathable membrane' },
          { name: 'Waterproof Rating', value: '20,000 mm hydrostatic head' },
          { name: 'Breathability Index', value: '15,000 g/m²/24h rating' },
          { name: 'Seam Construction', value: '100% seam tape bonded' }
        ],
        images: [
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?q=80&w=800&auto=format&fit=crop'
        ]
      }
    ];

    console.log('Seeding products inline...');
    const seededProducts = [];
    for (const prod of productsData) {
      const p = await Product.create(prod);
      seededProducts.push(p);
    }

    console.log('Adding Mock Reviews inline...');
    const comments = [
      'Incredible performance. The responsiveness is unmatched.',
      'Premium material quality. You can tell they put a lot of research into these.',
      'Absolute beast on the court. Traction is solid.',
      'Elite product. Completely moves beyond limits!',
      'Fast delivery and fit is true to size. High energy design.'
    ];

    const users = [regularUser1, regularUser2];

    for (const product of seededProducts) {
      for (let i = 0; i < 2; i++) {
        const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 rating
        await Review.create({
          product: product._id,
          user: users[i]._id,
          name: users[i].name,
          rating,
          comment: comments[Math.floor(Math.random() * comments.length)]
        });
      }
    }

    console.log('Seeding Coupons inline...');
    await Coupon.create({
      code: 'VELOCITY10',
      discountPercent: 10,
      minSpend: 50,
      expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    await Coupon.create({
      code: 'LIMITLESS20',
      discountPercent: 20,
      minSpend: 150,
      expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    console.log('--- INLINE SEEDING COMPLETE ---');
  } catch (error) {
    console.error('Inline Seeding Error:', error);
  }
};

module.exports = { seedDataInline };
