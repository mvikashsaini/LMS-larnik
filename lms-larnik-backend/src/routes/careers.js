const express = require('express');
const router = express.Router();
const {
  getCareers,
  getCareer,
  createCareer,
  updateCareer,
  deleteCareer,
  approveCareer,
  applyForCareer,
  reviewApplication,
  getCareerStats
} = require('../controllers/careerController');

const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { body } = require('express-validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     Career:
 *       type: object
 *       required:
 *         - title
 *         - type
 *         - description
 *         - company
 *         - location
 *         - category
 *         - contactInfo
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 200
 *           description: Career opportunity title
 *         type:
 *           type: string
 *           enum: [job, webinar, internship, workshop]
 *           description: Type of opportunity
 *         description:
 *           type: string
 *           description: Detailed description
 *         company:
 *           type: string
 *           description: Company name
 *         location:
 *           type: string
 *           description: Location
 *         category:
 *           type: string
 *           enum: [technology, education, healthcare, finance, marketing, design, other]
 *           description: Category
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *           description: List of requirements
 *         responsibilities:
 *           type: array
 *           items:
 *             type: string
 *           description: List of responsibilities
 *         benefits:
 *           type: array
 *           items:
 *             type: string
 *           description: List of benefits
 *         salary:
 *           type: object
 *           properties:
 *             min:
 *               type: number
 *             max:
 *               type: number
 *             currency:
 *               type: string
 *               default: INR
 *             period:
 *               type: string
 *               enum: [hourly, daily, weekly, monthly, yearly]
 *               default: monthly
 *         experience:
 *           type: object
 *           properties:
 *             min:
 *               type: number
 *               default: 0
 *             max:
 *               type: number
 *         education:
 *           type: string
 *           enum: [high_school, bachelor, master, phd, any]
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: Required skills
 *         contactInfo:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             phone:
 *               type: string
 *             website:
 *               type: string
 *         applicationDeadline:
 *           type: string
 *           format: date
 *         startDate:
 *           type: string
 *           format: date
 *         duration:
 *           type: string
 *         maxApplicants:
 *           type: number
 *         seo:
 *           type: object
 *           properties:
 *             metaTitle:
 *               type: string
 *             metaDescription:
 *               type: string
 *             keywords:
 *               type: array
 *               items:
 *                 type: string
 *     CareerApproval:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [approved, rejected]
 *           description: Approval status
 *         feedback:
 *           type: string
 *           description: Approval feedback
 *     CareerApplication:
 *       type: object
 *       properties:
 *         resume:
 *           type: string
 *           description: Resume file URL
 *         coverLetter:
 *           type: string
 *           description: Cover letter text
 *     ApplicationReview:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, reviewed, shortlisted, rejected, accepted]
 *           description: Application status
 *         feedback:
 *           type: string
 *           description: Review feedback
 */

/**
 * @swagger
 * /api/careers:
 *   get:
 *     summary: Get all career opportunities
 *     tags: [Careers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [job, webinar, internship, workshop]
 *         description: Filter by type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [technology, education, healthcare, finance, marketing, design, other]
 *         description: Filter by category
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: Filter by company
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title, description, company, and location
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Career opportunities retrieved successfully
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
 *                     type: object
 *                 pagination:
 *                   type: object
 */
router.get('/', getCareers);

/**
 * @swagger
 * /api/careers/{id}:
 *   get:
 *     summary: Get single career opportunity
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Career ID
 *     responses:
 *       200:
 *         description: Career opportunity retrieved successfully
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
 *         description: Invalid career ID
 *       404:
 *         description: Career opportunity not found
 */
router.get('/:id', getCareer);

/**
 * @swagger
 * /api/careers:
 *   post:
 *     summary: Create new career opportunity
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Career'
 *     responses:
 *       201:
 *         description: Career opportunity created successfully
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
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 */
router.post(
  '/',
  protect,
  authorize('careercell', 'superadmin'),
  [
    body('title').notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('type').isIn(['job', 'webinar', 'internship', 'workshop']).withMessage('Invalid type'),
    body('description').notEmpty().withMessage('Description is required'),
    body('company').notEmpty().withMessage('Company is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('category').isIn(['technology', 'education', 'healthcare', 'finance', 'marketing', 'design', 'other']).withMessage('Invalid category'),
    body('contactInfo.email').isEmail().withMessage('Valid email is required'),
    body('requirements').optional().isArray().withMessage('Requirements must be an array'),
    body('responsibilities').optional().isArray().withMessage('Responsibilities must be an array'),
    body('benefits').optional().isArray().withMessage('Benefits must be an array'),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
    body('education').optional().isIn(['high_school', 'bachelor', 'master', 'phd', 'any']).withMessage('Invalid education level')
  ],
  validate,
  createCareer
);

/**
 * @swagger
 * /api/careers/{id}:
 *   put:
 *     summary: Update career opportunity
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Career ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Career'
 *     responses:
 *       200:
 *         description: Career opportunity updated successfully
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
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized to update career opportunities
 *       404:
 *         description: Career opportunity not found
 */
router.put(
  '/:id',
  protect,
  authorize('careercell', 'superadmin'),
  [
    body('title').optional().isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
    body('type').optional().isIn(['job', 'webinar', 'internship', 'workshop']).withMessage('Invalid type'),
    body('category').optional().isIn(['technology', 'education', 'healthcare', 'finance', 'marketing', 'design', 'other']).withMessage('Invalid category'),
    body('contactInfo.email').optional().isEmail().withMessage('Valid email is required'),
    body('requirements').optional().isArray().withMessage('Requirements must be an array'),
    body('responsibilities').optional().isArray().withMessage('Responsibilities must be an array'),
    body('benefits').optional().isArray().withMessage('Benefits must be an array'),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
    body('education').optional().isIn(['high_school', 'bachelor', 'master', 'phd', 'any']).withMessage('Invalid education level')
  ],
  validate,
  updateCareer
);

/**
 * @swagger
 * /api/careers/{id}:
 *   delete:
 *     summary: Delete career opportunity
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Career ID
 *     responses:
 *       200:
 *         description: Career opportunity deleted successfully
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
 *                     message:
 *                       type: string
 *       400:
 *         description: Invalid career ID
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized to delete career opportunities
 *       404:
 *         description: Career opportunity not found
 */
router.delete('/:id', protect, authorize('careercell', 'superadmin'), deleteCareer);

/**
 * @swagger
 * /api/careers/{id}/approve:
 *   put:
 *     summary: Approve/publish career opportunity
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Career ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CareerApproval'
 *     responses:
 *       200:
 *         description: Career opportunity approval status updated successfully
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
 *                     message:
 *                       type: string
 *                     career:
 *                       type: object
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Career opportunity not found
 */
router.put(
  '/:id/approve',
  protect,
  authorize('careercell', 'superadmin'),
  [
    body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
    body('feedback').optional().isString().withMessage('Feedback must be a string')
  ],
  validate,
  approveCareer
);

/**
 * @swagger
 * /api/careers/{id}/apply:
 *   post:
 *     summary: Apply for career opportunity
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Career ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CareerApplication'
 *     responses:
 *       200:
 *         description: Application submitted successfully
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
 *                     message:
 *                       type: string
 *                     application:
 *                       type: object
 *       400:
 *         description: Invalid input or already applied
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Career opportunity not found
 */
router.post(
  '/:id/apply',
  protect,
  [
    body('resume').optional().isString().withMessage('Resume must be a string'),
    body('coverLetter').optional().isString().withMessage('Cover letter must be a string')
  ],
  validate,
  applyForCareer
);

/**
 * @swagger
 * /api/careers/{id}/applications/{applicationId}:
 *   put:
 *     summary: Review application
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Career ID
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationReview'
 *     responses:
 *       200:
 *         description: Application reviewed successfully
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
 *                     message:
 *                       type: string
 *                     application:
 *                       type: object
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Career opportunity or application not found
 */
router.put(
  '/:id/applications/:applicationId',
  protect,
  authorize('careercell', 'superadmin'),
  [
    body('status').isIn(['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted']).withMessage('Invalid application status'),
    body('feedback').optional().isString().withMessage('Feedback must be a string')
  ],
  validate,
  reviewApplication
);

/**
 * @swagger
 * /api/careers/stats:
 *   get:
 *     summary: Get career statistics
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *     responses:
 *       200:
 *         description: Career statistics retrieved successfully
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
 *                     typeStats:
 *                       type: array
 *                     categoryStats:
 *                       type: array
 *                     applicationStats:
 *                       type: array
 *       401:
 *         description: Not authorized
 */
router.get(
  '/stats',
  protect,
  authorize('careercell', 'superadmin'),
  getCareerStats
);

module.exports = router;
