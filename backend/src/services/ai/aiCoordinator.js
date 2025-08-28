/**
 * AI Service Coordinator
 * Manages fallback logic between different AI services for text processing
 */

import geminiService from './geminiService.js';
import logger from '../../utils/logger.js';

class AICoordinator {
  constructor() {
    this.services = [
      {
        name: 'Gemini',
        service: geminiService,
        priority: 1 // Primary service - best for Japanese and free tier
      }
    ];
    
    this.fallbackEnabled = true;
    this.preferredService = 'Gemini'; // Only service available
  }

  /**
   * Get available services ordered by priority
   */
  getAvailableServices() {
    const availableServices = this.services.map(({ name, service, priority }) => {
      const isAvailable = service.checkAvailability();
      logger.info(`Service availability check: ${name} = ${isAvailable}`);
      return { name, service, priority, isAvailable };
    })
    .filter(({ isAvailable }) => isAvailable)
    .sort((a, b) => a.priority - b.priority);
    
    logger.info(`Available services: ${availableServices.map(s => s.name).join(', ') || 'none'}`);
    return availableServices;
  }

  /**
   * Attempt text summarization with fallback logic
   */
  async summarizeText(text, options = {}) {
    const availableServices = this.getAvailableServices();
    
    if (availableServices.length === 0) {
      throw new Error('No AI services available for summarization');
    }

    let lastError = null;

    // Try each service in order of priority
    for (const { name, service } of availableServices) {
      try {
        logger.info(`Attempting summarization with ${name}`);
        const result = await service.summarizeText(text, options);
        
        logger.info(`Summarization successful with ${name}`, {
          textLength: text.length,
          summaryLength: result.length
        });
        
        return {
          summary: result,
          provider: name,
          method: 'ai'
        };
      } catch (error) {
        logger.warn(`Summarization failed with ${name}: ${error.message}`);
        lastError = error;
        continue;
      }
    }

    // If all AI services fail, throw error
    throw new Error(`All AI services failed. Last error: ${lastError?.message}`);
  }

  /**
   * Attempt keyword extraction with fallback logic
   */
  async extractKeywords(text, options = {}) {
    const availableServices = this.getAvailableServices();
    
    if (availableServices.length === 0) {
      throw new Error('No AI services available for keyword extraction');
    }

    let lastError = null;

    // Try each service in order of priority
    for (const { name, service } of availableServices) {
      try {
        logger.info(`Attempting keyword extraction with ${name}`);
        const result = await service.extractKeywords(text, options);
        
        logger.info(`Keyword extraction successful with ${name}`, {
          textLength: text.length,
          keywordCount: result.length
        });
        
        return {
          keywords: result,
          provider: name,
          method: 'ai'
        };
      } catch (error) {
        logger.warn(`Keyword extraction failed with ${name}: ${error.message}`);
        lastError = error;
        continue;
      }
    }

    // If all AI services fail, throw error
    throw new Error(`All AI services failed. Last error: ${lastError?.message}`);
  }



  /**
   * Get status of all AI services
   */
  getServicesStatus() {
    return {
      coordinator: {
        fallbackEnabled: this.fallbackEnabled,
        preferredService: this.preferredService
      },
      services: this.services.map(({ name, service, priority }) => ({
        ...service.getStatus(),
        priority
      }))
    };
  }

  /**
   * Set preferred service
   */
  setPreferredService(serviceName) {
    const validServices = this.services.map(s => s.name);
    if (validServices.includes(serviceName)) {
      this.preferredService = serviceName;
      // Adjust priorities
      this.services.forEach(service => {
        service.priority = service.name === serviceName ? 1 : 2;
      });
      logger.info(`Preferred AI service set to: ${serviceName}`);
    } else {
      throw new Error(`Invalid service name. Available: ${validServices.join(', ')}`);
    }
  }

  /**
   * Enable or disable fallback to local processing
   */
  setFallbackEnabled(enabled) {
    this.fallbackEnabled = enabled;
    logger.info(`AI fallback ${enabled ? 'enabled' : 'disabled'}`);
  }
}

// Export singleton instance
export default new AICoordinator();