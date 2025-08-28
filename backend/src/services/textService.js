/**
 * Enhanced text processing service with AI integration
 * Uses AI services (Google Gemini) with intelligent processing
 */

import aiCoordinator from './ai/aiCoordinator.js';
import logger from '../utils/logger.js';

/**
 * Summarize text using AI services with fallback to local implementation
 */
export const summarizeText = async (text, options = {}) => {
  if (!text || text.trim().length === 0) {
    throw new Error('Text is required for summarization');
  }

  const { maxLength = 150, minLength = 50, provider = null } = options;
  
  logger.info('Starting text summarization', {
    textLength: text.length,
    maxLength,
    minLength,
    preferredProvider: provider
  });

  try {
    // Set preferred provider if specified
    if (provider && ['Gemini'].includes(provider)) {
      aiCoordinator.setPreferredService(provider);
    }

    // Use AI coordinator to handle summarization with fallback
    const result = await aiCoordinator.summarizeText(text, { maxLength, minLength });
    
    // Ensure result has expected structure
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid result from AI coordinator');
    }
    
    logger.info('Summarization completed', {
      provider: result.provider || 'unknown',
      method: result.method || 'unknown',
      summaryLength: result.summary ? result.summary.length : 0,
      resultType: typeof result
    });

    return result;
  } catch (error) {
    logger.error('Text summarization failed:', error);
    throw error;
  }
};

/**
 * Extract keywords from text using AI services with fallback to local implementation
 */
export const extractKeywords = async (text, options = {}) => {
  if (!text || text.trim().length === 0) {
    throw new Error('Text is required for keyword extraction');
  }

  const { maxKeywords = 10, provider = null } = options;
  
  logger.info('Starting keyword extraction', {
    textLength: text.length,
    maxKeywords,
    preferredProvider: provider
  });

  try {
    // Set preferred provider if specified
    if (provider && ['Gemini'].includes(provider)) {
      aiCoordinator.setPreferredService(provider);
    }

    // Use AI coordinator to handle keyword extraction with fallback
    const result = await aiCoordinator.extractKeywords(text, { maxKeywords });
    
    // Ensure result has expected structure
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid result from AI coordinator');
    }
    
    logger.info('Keyword extraction completed', {
      provider: result.provider || 'unknown',
      method: result.method || 'unknown',
      keywordCount: result.keywords ? result.keywords.length : 0,
      resultType: typeof result
    });

    return result;
  } catch (error) {
    logger.error('Keyword extraction failed:', error);
    throw error;
  }
};

/**
 * Get AI services status
 */
export const getServicesStatus = () => {
  return aiCoordinator.getServicesStatus();
};

/**
 * Configure AI services
 */
export const configureServices = (config) => {
  const { preferredService, fallbackEnabled } = config;
  
  if (preferredService) {
    aiCoordinator.setPreferredService(preferredService);
  }
  
  if (typeof fallbackEnabled === 'boolean') {
    aiCoordinator.setFallbackEnabled(fallbackEnabled);
  }
  
  logger.info('AI services configuration updated', config);
  
  return aiCoordinator.getServicesStatus();
};