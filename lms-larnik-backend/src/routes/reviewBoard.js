const express = require('express');
const router = express.Router();
const {
  getPendingReviews,
  getCourseForReview,
  submitCourseReview,
  getReviewStats,
  assignReviewer,
  getMyAssignments
} = require('../controllers/reviewBoardController');

const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { body } = require('express-validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseReview:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [approved, rejected, needs_revision]
 *           description: Review status
 *         score:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Review score
 *         feedback:
 *           type: string
 *           description: Review feedback
 *         contentQuality:
 *           type: number
 *           minimum: 0
 *           maximum: 10
 *           description: Content quality score
 *         technicalAccuracy:
 *           type: number
 *           minimum: 0
 *           maximum: 10
 *           description: Technical accuracy score
 *         presentationQuality:
 *           type: number
 *           minimum: 0
 *           maximum: 10
 *           description: Presentation quality score
 *         accessibility:
 *           type: number
 *           minimum: 0
 *           maximum: 10
 *           description: Accessibility score
 *         complianceIssues:
 *           type: array
 *           items:
 *             type: string
 *           description: List of compliance issues
 *         recommendations:
 *           type: array
 *           items:
 *             type: string
 *           description: List of recommendations
 *     ReviewerAssignment:
 *       type: object
 *       required:
 *         - reviewerId
 *       properties:
 *         reviewerId:
 *           type: string
 *           description: Reviewer user ID
 *         priority:
 *           type: string
 *           enum: [low, normal, high, urgent]
 *           default: normal
 *           description: Review priority
 */

/**
 * @swagger
 * /api/review-board/pending:
 *   get:
 *     summary: Get all courses pending review
 *     tags: [Review Board]
 *     security:
 *       - bearerAuth: []
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
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: teacherId
 *         schema:
 *           type: string
 *         description: Filter by teacher ID
 *       - in: query
 *         name: universityId
 *         schema:
 *           type: string
 *         description: Filter by university ID
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, normal, high, urgent]
 *         description: Filter by priority
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
 *         description: Pending reviews retrieved successfully
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
 *       401:
 *         description: Not authorized
 */
router.get(
  '/pending',
  protect,
  authorize('reviewboard', 'superadmin'),
  getPendingReviews
);

/**
 * @swagger
 * /api/review-board/{id}:
 *   get:
 *     summary: Get single course for review
 *     tags: [Review Board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details retrieved successfully
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
 *         description: Invalid course ID
 *       404:
 *         description: Course not found
 *       401:
 *         description: Not authorized
 */
router.get(
  '/:id',
  protect,
  authorize('reviewboard', 'superadmin'),
  getCourseForReview
);

/**
 * @swagger
 * /api/review-board/{id}/review:
 *   post:
 *     summary: Submit course review
 *     tags: [Review Board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseReview'
 *     responses:
 *       200:
 *         description: Course review submitted successfully
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
 *                     review:
 *                       type: object
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Course not found
 *       401:
 *         description: Not authorized
 */
router.post(
  '/:id/review',
  protect,
  authorize('reviewboard', 'superadmin'),
  [
    body('status').isIn(['approved', 'rejected', 'needs_revision']).withMessage('Status must be approved, rejected, or needs_revision'),
    body('score').optional().isFloat({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
    body('contentQuality').optional().isFloat({ min: 0, max: 10 }).withMessage('Content quality must be between 0 and 10'),
    body('technicalAccuracy').optional().isFloat({ min: 0, max: 10 }).withMessage('Technical accuracy must be between 0 and 10'),
    body('presentationQuality').optional().isFloat({ min: 0, max: 10 }).withMessage('Presentation quality must be between 0 and 10'),
    body('accessibility').optional().isFloat({ min: 0, max: 10 }).withMessage('Accessibility must be between 0 and 10')
  ],
  validate,
  submitCourseReview
);

/**
 * @swagger
 * /api/review-board/stats:
 *   get:
 *     summary: Get review statistics
 *     tags: [Review Board]
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
 *       - in: query
 *         name: reviewerId
 *         schema:
 *           type: string
 *         description: Filter by reviewer ID
 *     responses:
 *       200:
 *         description: Review statistics retrieved successfully
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
 *                     pendingCount:
 *                       type: number
 *                     reviewerStats:
 *                       type: array
 *       401:
 *         description: Not authorized
 */
router.get(
  '/stats',
  protect,
  authorize('reviewboard', 'superadmin'),
  getReviewStats
);

/**
 * @swagger
 * /api/review-board/{id}/assign:
 *   post:
 *     summary: Assign reviewer to course
 *     tags: [Review Board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewerAssignment'
 *     responses:
 *       200:
 *         description: Reviewer assigned successfully
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
 *                     course:
 *                       type: object
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Course or reviewer not found
 *       401:
 *         description: Not authorized
 */
router.post(
  '/:id/assign',
  protect,
  authorize('reviewboard', 'superadmin'),
  [
    body('reviewerId').isMongoId().withMessage('Invalid reviewer ID'),
    body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('Priority must be low, normal, high, or urgent')
  ],
  validate,
  assignReviewer
);

/**
 * @swagger
 * /api/review-board/my-assignments:
 *   get:
 *     summary: Get my assigned reviews
 *     tags: [Review Board]
 *     security:
 *       - bearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, under_review, approved, rejected, needs_revision]
 *         description: Filter by review status
 *     responses:
 *       200:
 *         description: Assigned reviews retrieved successfully
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
 *       401:
 *         description: Not authorized
 */
router.get(
  '/my-assignments',
  protect,
  authorize('reviewboard', 'superadmin'),
  getMyAssignments
);

module.exports = router;
