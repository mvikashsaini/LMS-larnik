const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { body } = require('express-validator');
const {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoriesByCategory,
  getSubCategoryAnalytics,
  updateSubCategoryOrder
} = require('../controllers/subCategoryController');

/**
 * @swagger
 * components:
 *   schemas:
 *     SubCategory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         icon:
 *           type: string
 *         color:
 *           type: string
 *         isActive:
 *           type: boolean
 *         order:
 *           type: number
 *         metaTitle:
 *           type: string
 *         metaDescription:
 *           type: string
 *         keywords:
 *           type: string
 *         stats:
 *           type: object
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/subcategories:
 *   get:
 *     summary: Get all sub-categories
 *     tags: [SubCategories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by parent category
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name and description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of sub-categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubCategory'
 *                 pagination:
 *                   type: object
 */
router.get('/', getSubCategories);

/**
 * @swagger
 * /api/subcategories/category/{categoryId}:
 *   get:
 *     summary: Get sub-categories by category
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Sub-categories for the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubCategory'
 */
router.get('/category/:categoryId', getSubCategoriesByCategory);

/**
 * @swagger
 * /api/subcategories/{id}:
 *   get:
 *     summary: Get sub-category by ID
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sub-category ID
 *     responses:
 *       200:
 *         description: Sub-category details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SubCategory'
 *       404:
 *         description: Sub-category not found
 */
router.get('/:id', getSubCategory);

/**
 * @swagger
 * /api/subcategories:
 *   post:
 *     summary: Create new sub-category
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 description: Sub-category name
 *               category:
 *                 type: string
 *                 description: Parent category ID
 *               description:
 *                 type: string
 *                 description: Sub-category description
 *               icon:
 *                 type: string
 *                 description: Sub-category icon
 *               color:
 *                 type: string
 *                 description: Sub-category color
 *               order:
 *                 type: number
 *                 description: Display order
 *               metaTitle:
 *                 type: string
 *                 description: SEO meta title
 *               metaDescription:
 *                 type: string
 *                 description: SEO meta description
 *               keywords:
 *                 type: string
 *                 description: SEO keywords
 *     responses:
 *       201:
 *         description: Sub-category created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SubCategory'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access forbidden
 *       404:
 *         description: Parent category not found
 */
router.post('/', [
  protect,
  authorize('superAdmin', 'subAdmin'),
  body('name').notEmpty().withMessage('Sub-category name is required'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('icon').optional().isString().withMessage('Icon must be a string'),
  body('color').optional().isString().withMessage('Color must be a string'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive integer'),
  body('metaTitle').optional().isString().withMessage('Meta title must be a string'),
  body('metaDescription').optional().isString().withMessage('Meta description must be a string'),
  body('keywords').optional().isString().withMessage('Keywords must be a string'),
  validate
], createSubCategory);

/**
 * @swagger
 * /api/subcategories/{id}:
 *   put:
 *     summary: Update sub-category
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sub-category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Sub-category name
 *               category:
 *                 type: string
 *                 description: Parent category ID
 *               description:
 *                 type: string
 *                 description: Sub-category description
 *               icon:
 *                 type: string
 *                 description: Sub-category icon
 *               color:
 *                 type: string
 *                 description: Sub-category color
 *               order:
 *                 type: number
 *                 description: Display order
 *               isActive:
 *                 type: boolean
 *                 description: Active status
 *               metaTitle:
 *                 type: string
 *                 description: SEO meta title
 *               metaDescription:
 *                 type: string
 *                 description: SEO meta description
 *               keywords:
 *                 type: string
 *                 description: SEO keywords
 *     responses:
 *       200:
 *         description: Sub-category updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SubCategory'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access forbidden
 *       404:
 *         description: Sub-category or parent category not found
 */
router.put('/:id', [
  protect,
  authorize('superAdmin', 'subAdmin'),
  body('name').optional().notEmpty().withMessage('Sub-category name cannot be empty'),
  body('category').optional().isMongoId().withMessage('Valid category ID is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('icon').optional().isString().withMessage('Icon must be a string'),
  body('color').optional().isString().withMessage('Color must be a string'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('metaTitle').optional().isString().withMessage('Meta title must be a string'),
  body('metaDescription').optional().isString().withMessage('Meta description must be a string'),
  body('keywords').optional().isString().withMessage('Keywords must be a string'),
  validate
], updateSubCategory);

/**
 * @swagger
 * /api/subcategories/{id}:
 *   delete:
 *     summary: Delete sub-category
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sub-category ID
 *     responses:
 *       200:
 *         description: Sub-category deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Cannot delete sub-category with courses
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access forbidden
 *       404:
 *         description: Sub-category not found
 */
router.delete('/:id', protect, authorize('superAdmin', 'subAdmin'), deleteSubCategory);

/**
 * @swagger
 * /api/subcategories/{id}/analytics:
 *   get:
 *     summary: Get sub-category analytics
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sub-category ID
 *     responses:
 *       200:
 *         description: Sub-category analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                     monthlyStats:
 *                       type: array
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access forbidden
 *       404:
 *         description: Sub-category not found
 */
router.get('/:id/analytics', protect, authorize('superAdmin', 'subAdmin'), getSubCategoryAnalytics);

/**
 * @swagger
 * /api/subcategories/order:
 *   put:
 *     summary: Update sub-category order
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subCategories
 *             properties:
 *               subCategories:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     order:
 *                       type: number
 *     responses:
 *       200:
 *         description: Sub-category order updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access forbidden
 */
router.put('/order', [
  protect,
  authorize('superAdmin', 'subAdmin'),
  body('subCategories').isArray().withMessage('Sub-categories must be an array'),
  validate
], updateSubCategoryOrder);

module.exports = router;
