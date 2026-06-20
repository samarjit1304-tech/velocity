const Product = require('../models/Product');
const Review = require('../models/Review');
const Category = require('../models/Category');

// @desc    Get all products (with filters, sorting, search, pagination)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    // Search query
    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: 'i'
          }
        }
      : {};

    // Category filter
    let categoryFilter = {};
    if (req.query.category) {
      const foundCategory = await Category.findOne({ slug: req.query.category });
      if (foundCategory) {
        categoryFilter = { category: foundCategory._id };
      } else {
        return res.status(200).json({ success: true, products: [], page, pages: 0, total: 0 });
      }
    }

    // Brand filter
    const brandFilter = req.query.brand ? { brand: req.query.brand } : {};

    // Price filter
    let priceFilter = {};
    if (req.query.minPrice || req.query.maxPrice) {
      priceFilter.price = {};
      if (req.query.minPrice) priceFilter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.price.$lte = Number(req.query.maxPrice);
    }

    // Rating filter
    const ratingFilter = req.query.rating
      ? { rating: { $gte: Number(req.query.rating) } }
      : {};

    // Combine all filters
    const filter = { ...keyword, ...categoryFilter, ...brandFilter, ...priceFilter, ...ratingFilter };

    // Sorting
    let sort = {};
    if (req.query.sort === 'priceAsc') {
      sort = { price: 1 };
    } else if (req.query.sort === 'priceDesc') {
      sort = { price: -1 };
    } else if (req.query.sort === 'rating') {
      sort = { rating: -1 };
    } else if (req.query.sort === 'newest') {
      sort = { createdAt: -1 };
    } else {
      sort = { createdAt: -1 };
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category')
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.status(200).json({
      success: true,
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (product) {
      const reviews = await Review.find({ product: product._id })
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        product,
        reviews
      });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      product: req.params.id,
      user: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'Product already reviewed' });
    }

    const review = await Review.create({
      product: req.params.id,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI Product Recommendations & Similarities (Similarity Engine)
// @route   GET /api/products/:id/recommendations
// @access  Public
exports.getAIRecommendations = async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.id);
    if (!currentProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Similarity Engine: Fetch products of similar category or sharing tags
    const candidates = await Product.find({ _id: { $ne: currentProduct._id } }).populate('category');

    // Score candidates based on Jaccard similarity of tags and category match
    const scored = candidates.map(prod => {
      let score = 0;
      
      // Category match points
      if (prod.category && currentProduct.category && prod.category.toString() === currentProduct.category.toString()) {
        score += 3;
      }
      
      // Brand match points
      if (prod.brand === currentProduct.brand) {
        score += 2;
      }

      // Tag overlap match points
      if (prod.tags && currentProduct.tags) {
        const commonTags = prod.tags.filter(tag => currentProduct.tags.includes(tag));
        score += commonTags.length * 1.5;
      }

      return { product: prod, score };
    });

    // Sort by descending score
    scored.sort((a, b) => b.score - a.score);

    // Take top 4 recommendations
    const recommended = scored.slice(0, 4).map(item => item.product);

    res.status(200).json({
      success: true,
      recommendations: recommended
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fuzzy Smart Search Engine
// @route   GET /api/products/search/smart
// @access  Public
exports.getSmartSearch = async (req, res) => {
  try {
    const query = req.query.q || '';
    if (!query) {
      return res.status(200).json({ success: true, products: [] });
    }

    // Execute fuzzy search across text index
    const products = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(10)
    .populate('category');

    // If text search returned no results, fallback to regex keywords contains check
    if (products.length === 0) {
      const regexSearch = await Product.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { brand: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      })
      .limit(10)
      .populate('category');

      return res.status(200).json({ success: true, products: regexSearch });
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
