const mongoose = require('mongoose');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateObjectId } = require('../utils/validators');

// Blog Schema (since it wasn't in the original models, I'll define it here)
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Blog category is required'],
    enum: ['education', 'technology', 'career', 'industry', 'general']
  },
  tags: [{
    type: String,
    trim: true
  }],
  featuredImage: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'published', 'archived'],
    default: 'draft'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Indexes
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, isPublished: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ createdAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);

/**
 * @desc    Get all blogs (with filters)
 * @route   GET /api/blogs
 * @access  Public/Private
 */
const getBlogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    category,
    author,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (author) filter.author = author;
  
  // Public users can only see published blogs
  if (!req.user || !['blogmanager', 'superadmin'].includes(req.user.role)) {
    filter.isPublished = true;
    filter.status = 'published';
  }
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get blogs with populated data
  const blogs = await Blog.find(filter)
    .populate('author', 'firstName lastName email')
    .populate('approvedBy', 'firstName lastName')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Blog.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: blogs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * @desc    Get single blog
 * @route   GET /api/blogs/:id
 * @access  Public/Private
 */
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid blog ID'
    });
  }

  const filter = { _id: id };
  
  // Public users can only see published blogs
  if (!req.user || !['blogmanager', 'superadmin'].includes(req.user.role)) {
    filter.isPublished = true;
    filter.status = 'published';
  }

  const blog = await Blog.findOne(filter)
    .populate('author', 'firstName lastName email')
    .populate('approvedBy', 'firstName lastName')
    .populate('comments.user', 'firstName lastName');

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  // Increment views for published blogs
  if (blog.isPublished && blog.status === 'published') {
    blog.views += 1;
    await blog.save();
  }

  res.status(200).json({
    success: true,
    data: blog
  });
});

/**
 * @desc    Create new blog
 * @route   POST /api/blogs
 * @access  Private
 */
const createBlog = asyncHandler(async (req, res) => {
  const {
    title,
    content,
    excerpt,
    category,
    tags,
    featuredImage,
    seo
  } = req.body;

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Check if slug already exists
  const existingBlog = await Blog.findOne({ slug });
  if (existingBlog) {
    return res.status(400).json({
      success: false,
      message: 'A blog with this title already exists'
    });
  }

  const blog = await Blog.create({
    title,
    slug,
    content,
    excerpt,
    author: req.user.id,
    category,
    tags,
    featuredImage,
    seo,
    status: 'draft'
  });

  const populatedBlog = await Blog.findById(blog._id)
    .populate('author', 'firstName lastName email');

  res.status(201).json({
    success: true,
    data: populatedBlog
  });
});

/**
 * @desc    Update blog
 * @route   PUT /api/blogs/:id
 * @access  Private
 */
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid blog ID'
    });
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  // Check ownership or admin rights
  if (blog.author.toString() !== req.user.id && !['blogmanager', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this blog'
    });
  }

  // Generate new slug if title changed
  if (updateData.title && updateData.title !== blog.title) {
    const newSlug = updateData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existingBlog = await Blog.findOne({ slug: newSlug, _id: { $ne: id } });
    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: 'A blog with this title already exists'
      });
    }
    updateData.slug = newSlug;
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('author', 'firstName lastName email');

  res.status(200).json({
    success: true,
    data: updatedBlog
  });
});

/**
 * @desc    Delete blog
 * @route   DELETE /api/blogs/:id
 * @access  Private
 */
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid blog ID'
    });
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  // Check ownership or admin rights
  if (blog.author.toString() !== req.user.id && !['blogmanager', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this blog'
    });
  }

  await Blog.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    data: {
      message: 'Blog deleted successfully'
    }
  });
});

/**
 * @desc    Approve/reject blog
 * @route   PUT /api/blogs/:id/approve
 * @access  Private (Blog Manager, Super Admin)
 */
const approveBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, feedback } = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid blog ID'
    });
  }

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be approved or rejected'
    });
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  blog.status = status;
  blog.approvedBy = req.user.id;
  blog.approvedAt = new Date();

  if (status === 'approved') {
    blog.isPublished = true;
    blog.publishedAt = new Date();
  }

  await blog.save();

  const updatedBlog = await Blog.findById(id)
    .populate('author', 'firstName lastName email')
    .populate('approvedBy', 'firstName lastName');

  res.status(200).json({
    success: true,
    data: {
      message: `Blog ${status} successfully`,
      blog: updatedBlog
    }
  });
});

/**
 * @desc    Add comment to blog
 * @route   POST /api/blogs/:id/comments
 * @access  Private
 */
const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!validateObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid blog ID'
    });
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  const comment = {
    user: req.user.id,
    content,
    isApproved: ['blogmanager', 'superadmin'].includes(req.user.role) // Auto-approve admin comments
  };

  blog.comments.push(comment);
  await blog.save();

  const updatedBlog = await Blog.findById(id)
    .populate('comments.user', 'firstName lastName');

  res.status(200).json({
    success: true,
    data: {
      message: 'Comment added successfully',
      comment: updatedBlog.comments[updatedBlog.comments.length - 1]
    }
  });
});

/**
 * @desc    Get blog statistics
 * @route   GET /api/blogs/stats
 * @access  Private (Blog Manager, Super Admin)
 */
const getBlogStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
  }

  // Get blog statistics
  const stats = await Blog.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        totalBlogs: { $sum: 1 },
        publishedBlogs: {
          $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
        },
        draftBlogs: {
          $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
        },
        pendingBlogs: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        totalViews: { $sum: '$views' },
        totalLikes: { $sum: '$likes' },
        totalComments: { $sum: { $size: '$comments' } }
      }
    }
  ]);

  // Get category breakdown
  const categoryStats = await Blog.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get top blogs by views
  const topBlogs = await Blog.find({ isPublished: true })
    .sort({ views: -1 })
    .limit(5)
    .populate('author', 'firstName lastName')
    .select('title views author createdAt');

  res.status(200).json({
    success: true,
    data: {
      overview: stats[0] || {
        totalBlogs: 0,
        publishedBlogs: 0,
        draftBlogs: 0,
        pendingBlogs: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0
      },
      categoryStats,
      topBlogs
    }
  });
});

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  approveBlog,
  addComment,
  getBlogStats
};
