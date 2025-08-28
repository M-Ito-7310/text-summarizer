import express from 'express';
import { body } from 'express-validator';
import { 
  summarizeText, 
  extractKeywords, 
  analyzeText, 
  getServicesStatus, 
  configureServices 
} from '../controllers/textController.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Text summarization endpoint
router.post('/summarize',
  [
    body('text')
      .notEmpty()
      .withMessage('Text is required')
      .isLength({ min: 50 })
      .withMessage('Text must be at least 50 characters long'),
    body('maxLength')
      .optional()
      .isInt({ min: 10, max: 1000 })
      .withMessage('Max length must be between 10 and 1000 characters'),
    body('minLength')
      .optional()
      .isInt({ min: 5, max: 500 })
      .withMessage('Min length must be between 5 and 500 characters'),
    body('provider')
      .optional()
      .isIn(['Gemini'])
      .withMessage('Provider must be Gemini')
  ],
  validateRequest,
  summarizeText
);

// Keyword extraction endpoint
router.post('/keywords',
  [
    body('text')
      .notEmpty()
      .withMessage('Text is required')
      .isLength({ min: 10 })
      .withMessage('Text must be at least 10 characters long'),
    body('maxKeywords')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Max keywords must be between 1 and 50'),
    body('provider')
      .optional()
      .isIn(['Gemini'])
      .withMessage('Provider must be Gemini')
  ],
  validateRequest,
  extractKeywords
);

// Full text analysis endpoint
router.post('/analyze',
  [
    body('text')
      .notEmpty()
      .withMessage('Text is required')
      .isLength({ min: 50 })
      .withMessage('Text must be at least 50 characters long'),
    body('provider')
      .optional()
      .isIn(['Gemini'])
      .withMessage('Provider must be Gemini')
  ],
  validateRequest,
  analyzeText
);

// AI Services management endpoints
router.get('/services/status', getServicesStatus);

router.post('/services/configure',
  [
    body('preferredService')
      .optional()
      .isIn(['Gemini'])
      .withMessage('Preferred service must be Gemini'),
    body('fallbackEnabled')
      .optional()
      .isBoolean()
      .withMessage('Fallback enabled must be a boolean value')
  ],
  validateRequest,
  configureServices
);

export default router;