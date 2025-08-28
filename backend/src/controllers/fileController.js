import multer from 'multer';
import path from 'path';
import fs from 'fs';
import logger from '../utils/logger.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  const allowedExtensions = ['.pdf', '.docx', '.txt'];
  
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only PDF, DOCX, and TXT files are allowed.'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

export const processUploadedFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const { originalname, mimetype, buffer, size } = req.file;
    const fileExtension = path.extname(originalname).toLowerCase();
    
    logger.info('Processing uploaded file', {
      filename: originalname,
      mimetype: mimetype,
      size: size,
      extension: fileExtension
    });

    let extractedText = '';

    // Process file based on type
    switch (fileExtension) {
      case '.pdf':
        extractedText = await processPDF(buffer);
        break;
      case '.docx':
        extractedText = await processDOCX(buffer);
        break;
      case '.txt':
        extractedText = buffer.toString('utf-8');
        break;
      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }

    if (!extractedText.trim()) {
      return res.status(400).json({
        success: false,
        error: 'No text content found in the uploaded file'
      });
    }

    logger.info('File processed successfully', {
      filename: originalname,
      textLength: extractedText.length,
      wordCount: extractedText.split(/\s+/).length
    });

    res.json({
      success: true,
      data: {
        filename: originalname,
        fileSize: size,
        fileType: fileExtension,
        textContent: extractedText,
        metadata: {
          characterCount: extractedText.length,
          wordCount: extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0,
          processedAt: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    logger.error('File processing failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process uploaded file'
    });
  }
};

const processPDF = async (buffer) => {
  try {
    // Import PDF parse dynamically to avoid startup issues
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    logger.error('PDF processing failed:', error);
    throw new Error('Failed to extract text from PDF file');
  }
};

const processDOCX = async (buffer) => {
  try {
    // Import mammoth dynamically since it's only used here
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer: buffer });
    
    if (result.messages && result.messages.length > 0) {
      logger.warn('DOCX processing warnings:', result.messages);
    }
    
    return result.value;
  } catch (error) {
    logger.error('DOCX processing failed:', error);
    throw new Error('Failed to extract text from DOCX file');
  }
};

export const getFileInfo = async (req, res) => {
  try {
    const supportedFormats = [
      {
        extension: '.pdf',
        mimeType: 'application/pdf',
        description: 'PDF Document',
        maxSize: '5MB'
      },
      {
        extension: '.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        description: 'Microsoft Word Document',
        maxSize: '5MB'
      },
      {
        extension: '.txt',
        mimeType: 'text/plain',
        description: 'Plain Text File',
        maxSize: '5MB'
      }
    ];

    res.json({
      success: true,
      data: {
        supportedFormats: supportedFormats,
        maxFileSize: 5 * 1024 * 1024,
        maxFileSizeReadable: '5MB'
      }
    });
  } catch (error) {
    logger.error('Failed to get file info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve file information'
    });
  }
};