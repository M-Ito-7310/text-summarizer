import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';
import * as textService from '../services/textService.js';

// @desc    Summarize text
// @route   POST /api/text/summarize
// @access  Public
export const summarizeText = asyncHandler(async (req, res) => {
  const { text, maxLength = 150, minLength = 50, provider = null } = req.body;

  logger.info(`Summarization request - Text length: ${text.length}, Max: ${maxLength}, Min: ${minLength}, Provider: ${provider || 'auto'}`);

  try {
    const summary = await textService.summarizeText(text, { maxLength, minLength, provider });
    
    res.status(200).json({
      success: true,
      data: {
        originalLength: text.length,
        summaryLength: summary.length,
        summary,
        compressionRatio: ((text.length - summary.length) / text.length * 100).toFixed(1),
        provider: provider || 'auto'
      },
      message: 'Text summarized successfully'
    });
  } catch (error) {
    logger.error('Summarization failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to summarize text',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @desc    Extract keywords from text
// @route   POST /api/text/keywords
// @access  Public
export const extractKeywords = asyncHandler(async (req, res) => {
  const { text, maxKeywords = 10, provider = null } = req.body;

  logger.info(`Keyword extraction request - Text length: ${text.length}, Max keywords: ${maxKeywords}, Provider: ${provider || 'auto'}`);

  try {
    const keywords = await textService.extractKeywords(text, { maxKeywords, provider });
    
    res.status(200).json({
      success: true,
      data: {
        keywords,
        count: keywords.length,
        textLength: text.length,
        provider: provider || 'auto'
      },
      message: 'Keywords extracted successfully'
    });
  } catch (error) {
    logger.error('Keyword extraction failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to extract keywords',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @desc    Analyze text (summarize + extract keywords)
// @route   POST /api/text/analyze
// @access  Public
export const analyzeText = asyncHandler(async (req, res) => {
  const { 
    text, 
    summaryLength,
    maxLength,
    minLength,
    summaryOptions = {}, 
    keywordOptions = {}, 
    provider = null 
  } = req.body;
  
  // Use provided lengths or fall back to summaryOptions or defaults
  const finalMaxLength = maxLength || summaryOptions.maxLength || 150;
  const finalMinLength = minLength || summaryOptions.minLength || 50;
  const { maxKeywords = 10 } = keywordOptions;

  logger.info(`Full analysis request - Text length: ${text.length}, Summary length: ${summaryLength}, Max/Min: ${finalMaxLength}/${finalMinLength}, Keywords: ${maxKeywords}, Provider: ${provider || 'auto'}`);

  try {
    const [summaryResult, keywordResult] = await Promise.all([
      textService.summarizeText(text, { maxLength: finalMaxLength, minLength: finalMinLength, provider }),
      textService.extractKeywords(text, { maxKeywords, provider })
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        originalLength: text.length,
        summary: {
          text: summaryResult.summary,
          length: summaryResult.summary.length,
          compressionRatio: ((text.length - summaryResult.summary.length) / text.length * 100).toFixed(1),
          provider: summaryResult.provider,
          method: summaryResult.method
        },
        keywords: {
          list: keywordResult.keywords,
          count: keywordResult.keywords.length,
          provider: keywordResult.provider,
          method: keywordResult.method
        },
        metadata: {
          processedAt: new Date().toISOString(),
          wordCount: text.split(/\s+/).length,
          provider: provider || 'auto'
        }
      },
      message: 'Text analyzed successfully'
    });
  } catch (error) {
    logger.error('Text analysis failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze text',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @desc    Get AI services status
// @route   GET /api/text/services/status
// @access  Public
export const getServicesStatus = asyncHandler(async (req, res) => {
  try {
    const status = textService.getServicesStatus();
    
    res.status(200).json({
      success: true,
      data: status,
      message: 'AI services status retrieved successfully'
    });
  } catch (error) {
    logger.error('Failed to get services status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve services status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @desc    Configure AI services
// @route   POST /api/text/services/configure
// @access  Public
export const configureServices = asyncHandler(async (req, res) => {
  const { preferredService, fallbackEnabled } = req.body;

  logger.info('AI services configuration request', { preferredService, fallbackEnabled });

  try {
    const status = textService.configureServices({ preferredService, fallbackEnabled });
    
    res.status(200).json({
      success: true,
      data: status,
      message: 'AI services configured successfully'
    });
  } catch (error) {
    logger.error('Failed to configure services:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to configure services',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Configuration error'
    });
  }
});