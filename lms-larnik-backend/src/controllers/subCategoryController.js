const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');
const Course = require('../models/Course');

// @desc    Get all sub-categories
// @route   GET /api/subcategories
// @access  Public
const getSubCategories = async (req, res) => {
  const { page = 1, limit = 10, category, isActive, search, sortBy = 'order', sortOrder = 'asc' } = req.query;

  const query = {};

  // Apply filters
  if (category) query.category = category;
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    populate: [
      { path: 'category', select: 'name slug' }
    ]
  };

  const subCategories = await SubCategory.paginate(query, options);

  res.status(200).json({
    success: true,
    data: subCategories.docs,
    pagination: {
      page: subCategories.page,
      limit: subCategories.limit,
      totalDocs: subCategories.totalDocs,
      totalPages: subCategories.totalPages,
      hasNext: subCategories.hasNextPage,
      hasPrev: subCategories.hasPrevPage
    }
  });
};

// @desc    Get single sub-category
// @route   GET /api/subcategories/:id
// @access  Public
const getSubCategory = async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id)
    .populate('category', 'name slug description');

  if (!subCategory) {
    return res.status(404).json({
      success: false,
      error: 'Sub-category not found'
    });
  }

  res.status(200).json({
    success: true,
    data: subCategory
  });
};

// @desc    Create sub-category
// @route   POST /api/subcategories
// @access  Private (Admin)
const createSubCategory = async (req, res) => {
  const { name, category, description, icon, color, order, metaTitle, metaDescription, keywords } = req.body;

  // Check if parent category exists
  const parentCategory = await Category.findById(category);
  if (!parentCategory) {
    return res.status(404).json({
      success: false,
      error: 'Parent category not found'
    });
  }

  // Check if sub-category with same name exists in the same category
  const existingSubCategory = await SubCategory.findOne({ 
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    category: category
  });
  if (existingSubCategory) {
    return res.status(400).json({
      success: false,
      error: 'Sub-category with this name already exists in this category'
    });
  }

  const subCategory = await SubCategory.create({
    name,
    category,
    description,
    icon,
    color,
    order: order || 0,
    metaTitle,
    metaDescription,
    keywords
  });

  res.status(201).json({
    success: true,
    data: subCategory
  });
};

// @desc    Update sub-category
// @route   PUT /api/subcategories/:id
// @access  Private (Admin)
const updateSubCategory = async (req, res) => {
  const { name, category, description, icon, color, order, isActive, metaTitle, metaDescription, keywords } = req.body;

  const subCategory = await SubCategory.findById(req.params.id);
  if (!subCategory) {
    return res.status(404).json({
      success: false,
      error: 'Sub-category not found'
    });
  }

  // Check if parent category exists (if being changed)
  if (category && category !== subCategory.category.toString()) {
    const parentCategory = await Category.findById(category);
    if (!parentCategory) {
      return res.status(404).json({
        success: false,
        error: 'Parent category not found'
      });
    }
  }

  // Check if name is being changed and if it conflicts
  if (name && name !== subCategory.name) {
    const existingSubCategory = await SubCategory.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      category: category || subCategory.category,
      _id: { $ne: req.params.id }
    });
    if (existingSubCategory) {
      return res.status(400).json({
        success: false,
        error: 'Sub-category with this name already exists in this category'
      });
    }
  }

  // Update fields
  if (name !== undefined) subCategory.name = name;
  if (category !== undefined) subCategory.category = category;
  if (description !== undefined) subCategory.description = description;
  if (icon !== undefined) subCategory.icon = icon;
  if (color !== undefined) subCategory.color = color;
  if (order !== undefined) subCategory.order = order;
  if (isActive !== undefined) subCategory.isActive = isActive;
  if (metaTitle !== undefined) subCategory.metaTitle = metaTitle;
  if (metaDescription !== undefined) subCategory.metaDescription = metaDescription;
  if (keywords !== undefined) subCategory.keywords = keywords;

  await subCategory.save();

  res.status(200).json({
    success: true,
    data: subCategory
  });
};

// @desc    Delete sub-category
// @route   DELETE /api/subcategories/:id
// @access  Private (Admin)
const deleteSubCategory = async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id);
  if (!subCategory) {
    return res.status(404).json({
      success: false,
      error: 'Sub-category not found'
    });
  }

  // Check if sub-category has courses
  const courses = await Course.find({ subCategory: req.params.id });
  if (courses.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Cannot delete sub-category with courses. Please move or delete courses first.'
    });
  }

  await subCategory.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
};

// @desc    Get sub-categories by category
// @route   GET /api/subcategories/category/:categoryId
// @access  Public
const getSubCategoriesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { isActive } = req.query;

  const query = { category: categoryId };
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const subCategories = await SubCategory.find(query)
    .select('name slug description icon color isActive order')
    .sort('order')
    .lean();

  res.status(200).json({
    success: true,
    data: subCategories
  });
};

// @desc    Get sub-category analytics
// @route   GET /api/subcategories/:id/analytics
// @access  Private (Admin)
const getSubCategoryAnalytics = async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id);
  if (!subCategory) {
    return res.status(404).json({
      success: false,
      error: 'Sub-category not found'
    });
  }

  const [
    totalCourses,
    totalEnrollments,
    totalRevenue,
    monthlyStats
  ] = await Promise.all([
    Course.countDocuments({ subCategory: req.params.id, isPublished: true }),
    Course.aggregate([
      { $match: { subCategory: subCategory._id, isPublished: true } },
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'enrollments'
        }
      },
      { $unwind: '$enrollments' },
      { $count: 'total' }
    ]),
    Course.aggregate([
      { $match: { subCategory: subCategory._id, isPublished: true } },
      {
        $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: 'course',
          as: 'payments'
        }
      },
      { $unwind: '$payments' },
      { $match: { 'payments.status': 'completed' } },
      { $group: { _id: null, total: { $sum: '$payments.amount' } } }
    ]),
    Course.aggregate([
      { $match: { subCategory: subCategory._id, isPublished: true } },
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'enrollments'
        }
      },
      { $unwind: '$enrollments' },
      {
        $group: {
          _id: {
            year: { $year: '$enrollments.enrolledAt' },
            month: { $month: '$enrollments.enrolledAt' }
          },
          enrollments: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ])
  ]);

  const analytics = {
    overview: {
      totalCourses,
      totalEnrollments: totalEnrollments[0]?.total || 0,
      totalRevenue: totalRevenue[0]?.total || 0
    },
    monthlyStats
  };

  res.status(200).json({
    success: true,
    data: analytics
  });
};

// @desc    Update sub-category order
// @route   PUT /api/subcategories/order
// @access  Private (Admin)
const updateSubCategoryOrder = async (req, res) => {
  const { subCategories } = req.body;

  if (!Array.isArray(subCategories)) {
    return res.status(400).json({
      success: false,
      error: 'Sub-categories must be an array'
    });
  }

  // Update order for each sub-category
  const updatePromises = subCategories.map(({ id, order }) => 
    SubCategory.findByIdAndUpdate(id, { order }, { new: true })
  );

  await Promise.all(updatePromises);

  res.status(200).json({
    success: true,
    message: 'Sub-category order updated successfully'
  });
};

module.exports = {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoriesByCategory,
  getSubCategoryAnalytics,
  updateSubCategoryOrder
};
