/**
 * Google Gemini AI Service
 * Provides text summarization and keyword extraction using Google's Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../../utils/logger.js';

class GeminiService {
  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY; // Using existing env var
    this.isAvailable = !!this.apiKey && !this.apiKey.includes('your_google_api_key_here');
    
    logger.info('Gemini service initialization', {
      hasApiKey: !!this.apiKey,
      keyFormat: this.apiKey && !this.apiKey.includes('your_google_api_key_here') 
        ? `${this.apiKey.substring(0, 7)}...${this.apiKey.substring(this.apiKey.length - 4)}` 
        : 'none',
      keyLength: this.apiKey ? this.apiKey.length : 0
    });
    
    if (this.isAvailable) {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        // Use Gemini 1.5 Flash for cost optimization and Japanese support
        this.model = this.genAI.getGenerativeModel({ 
          model: 'gemini-1.5-flash',
          generationConfig: {
            temperature: 0.1, // Lower for more consistent, focused output
            topK: 20,        // Lower for more focused responses
            topP: 0.8,       // Lower for less randomness
            maxOutputTokens: 200, // Much lower limit for short summaries
          }
        });
        logger.info('Gemini service initialized successfully with API key');
      } catch (error) {
        logger.error('Failed to initialize Gemini service:', error);
        this.isAvailable = false;
      }
    } else {
      logger.warn('Gemini API key not configured - service will be unavailable');
    }
    
    // Load persisted usage data
    this.usageFile = process.cwd() + '/.gemini-usage.json';
    this.rateLimit = this.loadUsageData();
  }

  /**
   * Load usage data from persistent storage
   */
  loadUsageData() {
    try {
      const fs = require('fs');
      if (fs.existsSync(this.usageFile)) {
        const data = JSON.parse(fs.readFileSync(this.usageFile, 'utf8'));
        const now = Date.now();
        
        // Check if we need to reset daily counter
        if (now > data.resetTime) {
          // Reset daily counter
          return {
            requests: 0,
            resetTime: now + 24 * 60 * 60 * 1000,
            maxRequests: 1500,
            totalRequests: data.totalRequests || 0 // Keep total for reference
          };
        }
        
        return {
          requests: data.requests || 0,
          resetTime: data.resetTime || (now + 24 * 60 * 60 * 1000),
          maxRequests: 1500,
          totalRequests: data.totalRequests || 0
        };
      }
    } catch (error) {
      logger.warn('Failed to load usage data:', error.message);
    }
    
    // Default values
    return {
      requests: 0,
      resetTime: Date.now() + 24 * 60 * 60 * 1000,
      maxRequests: 1500,
      totalRequests: 0
    };
  }

  /**
   * Save usage data to persistent storage
   */
  saveUsageData() {
    try {
      const fs = require('fs');
      const data = {
        requests: this.rateLimit.requests,
        resetTime: this.rateLimit.resetTime,
        maxRequests: this.rateLimit.maxRequests,
        totalRequests: this.rateLimit.totalRequests,
        lastUpdated: Date.now()
      };
      fs.writeFileSync(this.usageFile, JSON.stringify(data, null, 2));
    } catch (error) {
      logger.warn('Failed to save usage data:', error.message);
    }
  }

  /**
   * Check if service is available and within rate limits
   */
  checkAvailability() {
    if (!this.isAvailable || !this.model) {
      return false;
    }

    const now = Date.now();
    
    // Reset rate limit counter if time window has passed
    if (now > this.rateLimit.resetTime) {
      this.rateLimit.requests = 0;
      this.rateLimit.resetTime = now + 60000;
    }
    
    // Check rate limit
    if (this.rateLimit.requests >= this.rateLimit.maxRequests) {
      logger.warn('Google Gemini rate limit reached');
      return false;
    }
    
    return true;
  }

  /**
   * Increment rate limit counter
   */
  incrementRateLimit() {
    this.rateLimit.requests++;
    this.rateLimit.totalRequests = (this.rateLimit.totalRequests || 0) + 1;
    
    // Save to persistent storage
    this.saveUsageData();
    
    logger.info('Gemini usage updated:', {
      dailyRequests: this.rateLimit.requests,
      totalRequests: this.rateLimit.totalRequests,
      remaining: this.rateLimit.maxRequests - this.rateLimit.requests
    });
  }

  /**
   * Summarize text using Google Gemini
   */
  async summarizeText(text, options = {}) {
    if (!this.checkAvailability()) {
      throw new Error('Google Gemini service unavailable or rate limited');
    }

    const { maxLength = 150, minLength = 50 } = options;

    try {
      this.incrementRateLimit();
      
      logger.info('Gemini: Starting text summarization', {
        textLength: text.length,
        maxLength,
        minLength
      });

      // Detect language and use appropriate prompt
      const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
      
      const prompt = isJapanese 
        ? `以下の文章を正確に${maxLength}文字以内で要約してください。これは厳密な制限です。

【絶対に守る制約】
- 文字数: ${minLength}文字以上、${maxLength}文字以内（必須）
- 必ず「。」で終わる完全な文のみ
- 文の途中で切れてはいけません
- 固有名詞（会社名、製品名）は正確に記載

要約対象の文章:
${text}

${maxLength}文字以内の要約:`
        : `Please provide a concise summary of the following text. The summary should be between ${minLength} and ${maxLength} characters long, capture the main points, and maintain the original meaning. Focus on accuracy for technical content and preserve proper nouns.

Text to summarize:
${text}

Summary:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text().trim();
      
      if (!summary) {
        throw new Error('No summary generated by Gemini model');
      }

      // Ensure summary meets length requirements and ends properly
      let finalSummary = summary.trim();
      
      logger.info('Gemini raw summary:', { 
        original: summary,
        trimmed: finalSummary,
        lastChar: finalSummary.slice(-1),
        length: finalSummary.length,
        isJapanese
      });
      
      // Language-specific ending validation
      const incompleteEndings = isJapanese 
        ? /[とがはをにへでからまでよりのやかもでもだけしかこそさえすらなどなんてばかりまでもくらいち]$/
        : /[,;:]$/; // English incomplete endings
      
      const properEndings = isJapanese 
        ? /[。！？]$/ 
        : /[.!?]$/; // English proper endings
      
      if (incompleteEndings.test(finalSummary) || !properEndings.test(finalSummary)) {
        logger.info('Summary needs fixing - incomplete ending detected');
        
        // Language-specific sentence handling
        if (isJapanese) {
          // Find the last complete Japanese sentence ending
          const sentences = finalSummary.match(/[^。！？]*[。！？]/g) || [];
          logger.info('Found Japanese sentences:', { sentences, count: sentences.length });
          
          if (sentences.length > 0) {
            finalSummary = sentences.join('');
            logger.info('Using complete Japanese sentences:', { result: finalSummary });
          } else {
            // Add Japanese period if missing
            const lastPeriodIndex = finalSummary.lastIndexOf('。');
            if (lastPeriodIndex > finalSummary.length * 0.5) {
              finalSummary = finalSummary.substring(0, lastPeriodIndex + 1);
            } else {
              finalSummary = finalSummary.replace(/[とがはをにへでからまでよりのやかもでもだけしかこそさえすらなどなんてばかりまでもくらいち]+$/, '');
              if (!/[。！？]$/.test(finalSummary)) {
                finalSummary += '。';
              }
            }
            logger.info('Fixed Japanese ending:', { result: finalSummary });
          }
        } else {
          // Find the last complete English sentence ending
          const sentences = finalSummary.match(/[^.!?]*[.!?]/g) || [];
          logger.info('Found English sentences:', { sentences, count: sentences.length });
          
          if (sentences.length > 0) {
            finalSummary = sentences.join('');
            logger.info('Using complete English sentences:', { result: finalSummary });
          } else {
            // Add English period if missing
            const lastPeriodIndex = finalSummary.lastIndexOf('.');
            if (lastPeriodIndex > finalSummary.length * 0.5) {
              finalSummary = finalSummary.substring(0, lastPeriodIndex + 1);
            } else {
              finalSummary = finalSummary.replace(/[,;:]+$/, '');
              if (!/[.!?]$/.test(finalSummary)) {
                finalSummary += '.';
              }
            }
            logger.info('Fixed English ending:', { result: finalSummary });
          }
        }
      }
      
      if (finalSummary.length > maxLength) {
        logger.info('Summary too long, cutting:', { 
          originalLength: finalSummary.length,
          maxLength,
          needsCutting: true
        });
        
        // Language-specific cutting logic
        if (isJapanese) {
          // Japanese sentence cutting
          const sentences = finalSummary.match(/[^。！？]*[。！？]/g) || [];
          logger.info('Available Japanese sentences for cutting:', { sentences, count: sentences.length });
          
          let bestSummary = '';
          for (const sentence of sentences) {
            if ((bestSummary + sentence).length <= maxLength) {
              bestSummary += sentence;
            } else {
              break;
            }
          }
          
          if (bestSummary.length >= maxLength * 0.6 && bestSummary.length > 0) {
            finalSummary = bestSummary;
            logger.info('Cut at Japanese sentence boundary:', { result: finalSummary, length: finalSummary.length });
          } else {
            // Manual Japanese cutting
            let cutPoint = maxLength - 1;
            const lastPeriodIndex = finalSummary.lastIndexOf('。', cutPoint);
            
            if (lastPeriodIndex > maxLength * 0.5) {
              finalSummary = finalSummary.substring(0, lastPeriodIndex + 1);
            } else {
              finalSummary = finalSummary.substring(0, cutPoint);
              finalSummary = finalSummary.replace(/[とがはをにへでからまでよりのやかもでもだけしかこそさえすらなどなんてばかりまでもくらいち]+$/, '');
              if (!/[。！？]$/.test(finalSummary)) {
                finalSummary += '。';
              }
            }
            logger.info('Manual Japanese cut and clean:', { result: finalSummary, length: finalSummary.length });
          }
        } else {
          // English sentence cutting
          const sentences = finalSummary.match(/[^.!?]*[.!?]/g) || [];
          logger.info('Available English sentences for cutting:', { sentences, count: sentences.length });
          
          let bestSummary = '';
          for (const sentence of sentences) {
            if ((bestSummary + sentence).length <= maxLength) {
              bestSummary += sentence;
            } else {
              break;
            }
          }
          
          if (bestSummary.length >= maxLength * 0.6 && bestSummary.length > 0) {
            finalSummary = bestSummary;
            logger.info('Cut at English sentence boundary:', { result: finalSummary, length: finalSummary.length });
          } else {
            // Manual English cutting
            let cutPoint = maxLength - 1;
            const lastPeriodIndex = finalSummary.lastIndexOf('.', cutPoint);
            
            if (lastPeriodIndex > maxLength * 0.5) {
              finalSummary = finalSummary.substring(0, lastPeriodIndex + 1);
            } else {
              finalSummary = finalSummary.substring(0, cutPoint);
              finalSummary = finalSummary.replace(/[,;:]+$/, '');
              if (!/[.!?]$/.test(finalSummary)) {
                finalSummary += '.';
              }
            }
            logger.info('Manual English cut and clean:', { result: finalSummary, length: finalSummary.length });
          }
        }
      } else {
        logger.info('Summary within length limit, no cutting needed');
      }

      logger.info('Gemini: Summarization completed', {
        originalLength: text.length,
        summaryLength: finalSummary.length
      });

      return finalSummary;
    } catch (error) {
      logger.error('Gemini summarization failed:', error);
      
      // Mark service as temporarily unavailable on persistent errors
      if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
        this.isAvailable = false;
        setTimeout(() => {
          this.isAvailable = true;
          logger.info('Gemini service availability restored');
        }, 300000); // 5 minutes cooldown
      }
      
      throw new Error(`Gemini summarization failed: ${error.message}`);
    }
  }

  /**
   * Extract keywords using Google Gemini
   */
  async extractKeywords(text, options = {}) {
    if (!this.checkAvailability()) {
      throw new Error('Google Gemini service unavailable or rate limited');
    }

    const { maxKeywords = 10 } = options;

    try {
      this.incrementRateLimit();
      
      logger.info('Gemini: Starting keyword extraction', {
        textLength: text.length,
        maxKeywords
      });

      // Detect language and use appropriate prompt
      const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
      
      const prompt = isJapanese
        ? `以下の文章から最も重要な${maxKeywords}個のキーワードとキーフレーズを抽出してください。
単語と複数語のフレーズの両方を含めて、内容に重要な語句を選択してください。
JSON配列形式で返してください。各項目は以下の形式: {"keyword": "用語", "type": "word" または "phrase", "relevance": 1-10の数値}

分析対象の文章:
${text}

キーワード（JSON形式）:`
        : `Extract the ${maxKeywords} most important keywords and key phrases from the following text. Include both single words and multi-word phrases that are significant to the content. Return them as a JSON array where each item has the format: {"keyword": "term", "type": "word" or "phrase", "relevance": number from 1-10}.

Text to analyze:
${text}

Keywords (JSON format):`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text().trim();
      
      // Parse the JSON response
      const keywords = this.parseKeywords(generatedText, maxKeywords);
      
      logger.info('Gemini: Keyword extraction completed', {
        keywordCount: keywords.length,
        rawResponse: generatedText.substring(0, 200) + '...',
        parsedKeywords: keywords.slice(0, 3).map(k => k.word)
      });

      return keywords;
    } catch (error) {
      logger.error('Gemini keyword extraction failed:', error);
      
      // Mark service as temporarily unavailable on persistent errors
      if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
        this.isAvailable = false;
        setTimeout(() => {
          this.isAvailable = true;
          logger.info('Gemini service availability restored');
        }, 300000); // 5 minutes cooldown
      }
      
      throw new Error(`Gemini keyword extraction failed: ${error.message}`);
    }
  }

  /**
   * Parse and clean extracted keywords from AI response
   */
  parseKeywords(text, maxKeywords) {
    try {
      // Try to extract JSON from the response
      let jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        // Try alternative JSON patterns
        jsonMatch = text.match(/\{[\s\S]*\}/g);
        if (jsonMatch) {
          text = '[' + jsonMatch.join(',') + ']';
        }
      } else {
        text = jsonMatch[0];
      }

      const parsedKeywords = JSON.parse(text);
      
      if (!Array.isArray(parsedKeywords)) {
        throw new Error('Invalid JSON format');
      }

      // Convert to our expected format
      const keywords = parsedKeywords
        .slice(0, maxKeywords)
        .map((item, index) => ({
          word: item.keyword || item.term || item.text || `keyword_${index + 1}`,
          score: (item.relevance || item.frequency || item.score || (10 - index)) / 10,
          frequency: maxKeywords - index,
          type: item.type || (item.keyword?.includes(' ') ? 'phrase' : 'word')
        }))
        .filter(item => item.word && item.word.length > 1);

      return keywords.length > 0 ? keywords : this.fallbackKeywords(maxKeywords);
    } catch (error) {
      logger.warn('Failed to parse Gemini JSON response, trying text parsing');
      
      // Fallback to text parsing
      try {
        const lines = text.split('\n')
          .filter(line => line.trim() && !line.includes('JSON') && !line.includes('format'))
          .slice(0, maxKeywords);

        const keywords = lines.map((line, index) => {
          // Clean the line
          const keyword = line
            .replace(/^\d+\.?\s*/, '') // Remove numbering
            .replace(/^[-*]\s*/, '') // Remove bullet points
            .replace(/[^\w\s]/g, '') // Remove special characters
            .trim();

          return {
            word: keyword || `keyword_${index + 1}`,
            score: (maxKeywords - index) / maxKeywords,
            frequency: maxKeywords - index,
            type: keyword.includes(' ') ? 'phrase' : 'word'
          };
        }).filter(item => item.word.length > 1);

        return keywords.length > 0 ? keywords : this.fallbackKeywords(maxKeywords);
      } catch (parseError) {
        logger.warn('Failed to parse Gemini keywords, using fallback');
        return this.fallbackKeywords(maxKeywords);
      }
    }
  }

  /**
   * Fallback keyword extraction using simple frequency analysis
   */
  fallbackKeywords(maxKeywords) {
    return Array.from({ length: Math.min(maxKeywords, 5) }, (_, i) => ({
      word: `keyword_${i + 1}`,
      score: (5 - i) / 5,
      frequency: 5 - i,
      type: 'word'
    }));
  }

  /**
   * Get service status including remaining quota
   */
  getStatus() {
    const now = Date.now();
    const timeUntilReset = Math.max(0, this.rateLimit.resetTime - now);
    const hoursUntilReset = Math.floor(timeUntilReset / (1000 * 60 * 60));
    const minutesUntilReset = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      service: 'Google Gemini',
      available: this.isAvailable,
      apiKeyConfigured: !!this.apiKey,
      model: 'gemini-1.5-flash',
      rateLimit: {
        requests: this.rateLimit.requests,
        maxRequests: this.rateLimit.maxRequests,
        remaining: this.rateLimit.maxRequests - this.rateLimit.requests,
        resetTime: new Date(this.rateLimit.resetTime).toLocaleString(),
        timeUntilReset: `${hoursUntilReset}h ${minutesUntilReset}m`
      },
      quota: {
        dailyLimit: 1500,
        used: this.rateLimit.requests,
        remaining: 1500 - this.rateLimit.requests,
        percentageUsed: Math.round((this.rateLimit.requests / 1500) * 100),
        totalRequests: this.rateLimit.totalRequests || 0,
        note: "Tracking based on local usage counter. Actual API usage may differ."
      }
    };
  }
}

// Export singleton instance
export default new GeminiService();