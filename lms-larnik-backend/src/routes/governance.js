const express = require('express');
const router = express.Router();
const {
  validateMoU,
  validateCertificate,
  getPendingValidations,
  getValidationStats,
  bulkValidateCertificates
} = require('../controllers/governanceController');

const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { body } = require('express-validator');

/**
 * @swagger
 * components:
 *   schemas:
 *     MoUValidation:
 *       type: object
 *       required:
 *         - universityId
 *         - mouId
 *         - status
 *       properties:
 *         universityId:
 *           type: string
 *           description: University ID
 *         mouId:
 *           type: string
 *           description: MoU document ID
 *         status:
 *           type: string
 *           enum: [approved, rejected]
 *           description: Validation status
 *         comments:
 *           type: string
 *           description: Validation comments
 *     CertificateValidation:
 *       type: object
 *       required:
 *         - certificateId
 *         - status
 *       properties:
 *         certificateId:
 *           type: string
 *           description: Certificate ID
 *         status:
 *           type: string
 *           enum: [approved, rejected]
 *           description: Validation status
 *         comments:
 *           type: string
 *           description: Validation comments
 *     BulkCertificateValidation:
 *       type: object
 *       required:
 *         - certificateIds
 *         - status
 *       properties:
 *         certificateIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of certificate IDs
 *         status:
 *           type: string
 *           enum: [approved, rejected]
 *           description: Validation status
 *         comments:
 *           type: string
 *           description: Validation comments
 */

/**
 * @swagger
 * /api/governance/validate-mou:
 *   post:
 *     summary: Validate MoU documents
 *     tags: [Governance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MoUValidation'
 *     responses:
 *       200:
 *         description: MoU validation successful
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
 *                     mou:
 *                       type: object
 *       400:
 *         description: Invalid input
 *       404:
 *         description: University or MoU not found
 *       401:
 *         description: Not authorized
 */
router.post(
  '/validate-mou',
  protect,
  authorize('superadmin'),
  [
    body('universityId').isMongoId().withMessage('Invalid university ID'),
    body('mouId').notEmpty().withMessage('MoU ID is required'),
    body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected')
  ],
  validate,
  validateMoU
);

/**
 * @swagger
 * /api/governance/validate-certificate:
 *   post:
 *     summary: Validate certificates
 *     tags: [Governance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CertificateValidation'
 *     responses:
 *       200:
 *         description: Certificate validation successful
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
 *                     certificate:
 *                       type: object
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Certificate not found
 *       401:
 *         description: Not authorized
 */
router.post(
  '/validate-certificate',
  protect,
  authorize('superadmin'),
  [
    body('certificateId').isMongoId().withMessage('Invalid certificate ID'),
    body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected')
  ],
  validate,
  validateCertificate
);

/**
 * @swagger
 * /api/governance/pending-validations:
 *   get:
 *     summary: Get all pending validations
 *     tags: [Governance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [mou, certificate]
 *         description: Type of validation to filter
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
 *     responses:
 *       200:
 *         description: Pending validations retrieved successfully
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
 *                     mous:
 *                       type: array
 *                     certificates:
 *                       type: array
 *                 pagination:
 *                   type: object
 *       401:
 *         description: Not authorized
 */
router.get(
  '/pending-validations',
  protect,
  authorize('superadmin'),
  getPendingValidations
);

/**
 * @swagger
 * /api/governance/validation-stats:
 *   get:
 *     summary: Get validation statistics
 *     tags: [Governance]
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
 *         description: Validation statistics retrieved successfully
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
 *                     certificates:
 *                       type: array
 *                     mous:
 *                       type: array
 *       401:
 *         description: Not authorized
 */
router.get(
  '/validation-stats',
  protect,
  authorize('superadmin'),
  getValidationStats
);

/**
 * @swagger
 * /api/governance/bulk-validate-certificates:
 *   post:
 *     summary: Bulk validate certificates
 *     tags: [Governance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkCertificateValidation'
 *     responses:
 *       200:
 *         description: Bulk validation completed successfully
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
 *                     modifiedCount:
 *                       type: number
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 */
router.post(
  '/bulk-validate-certificates',
  protect,
  authorize('superadmin'),
  [
    body('certificateIds').isArray().withMessage('Certificate IDs must be an array'),
    body('certificateIds.*').isMongoId().withMessage('Invalid certificate ID'),
    body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected')
  ],
  validate,
  bulkValidateCertificates
);

module.exports = router;
