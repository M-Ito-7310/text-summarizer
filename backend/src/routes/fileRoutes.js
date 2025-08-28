import express from 'express';
import { body } from 'express-validator';
import { upload, processUploadedFile, getFileInfo } from '../controllers/fileController.js';
import { validateRequest } from '../middleware/validation.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get supported file formats and limits
router.get('/info', getFileInfo);

// File upload and processing endpoint
router.post('/upload',
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        logger.error('File upload error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            success: false,
            error: 'File too large. Maximum size is 5MB.'
          });
        }
        if (err.message.includes('Unsupported file type')) {
          return res.status(400).json({
            success: false,
            error: err.message
          });
        }
        return res.status(500).json({
          success: false,
          error: 'File upload failed'
        });
      }
      next();
    });
  },
  processUploadedFile
);

// Direct text analysis from uploaded file
router.post('/analyze',
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        logger.error('File upload error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            success: false,
            error: 'File too large. Maximum size is 5MB.'
          });
        }
        if (err.message.includes('Unsupported file type')) {
          return res.status(400).json({
            success: false,
            error: err.message
          });
        }
        return res.status(500).json({
          success: false,
          error: 'File upload failed'
        });
      }
      next();
    });
  },
  [
    body('summaryOptions.maxLength')
      .optional()
      .isInt({ min: 50, max: 1000 })
      .withMessage('Max length must be between 50 and 1000 characters'),
    body('summaryOptions.minLength')
      .optional()
      .isInt({ min: 10, max: 500 })
      .withMessage('Min length must be between 10 and 500 characters'),
    body('keywordOptions.maxKeywords')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Max keywords must be between 1 and 50')
  ],
  validateRequest,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      // First process the file to extract text
      const fileProcessingResult = await processFileForText(req.file);
      
      if (!fileProcessingResult.success) {
        return res.status(400).json(fileProcessingResult);
      }

      // Then analyze the extracted text
      const textService = await import('../services/textService.js');
      const analysisResult = await textService.summarizeText(
        fileProcessingResult.data.textContent,
        req.body.summaryOptions || {}
      );
      
      const keywordResult = await textService.extractKeywords(
        fileProcessingResult.data.textContent,
        req.body.keywordOptions || {}
      );

      res.json({
        success: true,
        data: {
          fileInfo: fileProcessingResult.data,
          summary: analysisResult,
          keywords: keywordResult
        }
      });

    } catch (error) {
      logger.error('File analysis failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to analyze uploaded file'
      });
    }
  }
);

// Helper function for processing files (reusing logic from controller)
async function processFileForText(file) {
  try {
    const { processUploadedFile } = await import('../controllers/fileController.js');
    
    // Create a mock request/response to reuse the processing logic
    const mockReq = { file };
    let result = null;
    let error = null;
    
    const mockRes = {
      json: (data) => { result = data; },
      status: (code) => ({
        json: (data) => { error = { code, ...data }; }
      })
    };
    
    await processUploadedFile(mockReq, mockRes);
    
    if (error) {
      return error;
    }
    
    return result;
  } catch (err) {
    logger.error('File processing error:', err);
    return {
      success: false,
      error: 'Failed to process file'
    };
  }
}

export default router;