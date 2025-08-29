# Text Summarizer & Keyword Extractor

AI-powered text analysis tool with Japanese language support. This application provides intelligent text summarization and keyword extraction using Google Gemini API with local processing fallback.

![Project Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/node.js-22%2B-green)
![Vue.js](https://img.shields.io/badge/vue.js-3.5-green)

**Languages**: English | [日本語](README.ja.md)

## Overview

This project demonstrates advanced AI integration, modern web development practices, and production-ready architecture. Built as a portfolio project for freelance web engineering, it combines cutting-edge AI technology with practical business applications.

## Architecture Overview

### System Components
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vue.js Web    │    │   Express API   │    │  Google Gemini  │
│   Frontend      │◄──►│   Backend       │◄──►│   AI Service    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Features

#### 🔍 **Text Analysis**
- **AI-Powered Summarization**: Google Gemini 1.5 Flash model for high-quality Japanese abstractive summaries
- **Smart Keyword Extraction**: Advanced frequency analysis with Japanese language optimization
- **Multiple Length Options**: Short (50-100), Medium (100-200), Long (200-400) characters with clear indicators
- **Language-Aware Processing**: Automatic detection and appropriate counting (sentences for Japanese, words for English)
- **Real-time Processing**: Instant analysis with compression ratio display

#### 📁 **File Processing**
- **TXT File Support**: Direct text file upload and processing with test sample download
- **Drag & Drop Interface**: Modern file upload experience with visual feedback
- **File Size Limit**: 5MB maximum for optimal processing
- **Language-Aware Display**: Proper text counting based on content language
- **Future Support**: PDF and DOCX planned for upcoming releases

#### 🌐 **Language Support**
- **Japanese Text Processing**: Optimized for Japanese with full Unicode support (Hiragana, Katakana, Kanji)
- **Bilingual Interface**: Japanese/English UI with vue-i18n
- **Mixed Language Content**: Handles multilingual documents seamlessly
- **Smart Phrase Detection**: Identifies technical terms and compound words

#### 🎨 **User Interface**
- **Modern Design**: Clean, responsive interface with dark/light mode toggle
- **Interactive Results**: Visual keyword grid with hover effects and language-specific statistics
- **Activity Dashboard**: Separate tracking for Japanese (sentences) and English (words) processing
- **Enhanced PDF Export**: Multi-page export with original text inclusion
- **Processing History**: Local storage with pagination, search, and language-aware display
- **Organized Layout**: Optimized information hierarchy with Activity → History → Pro Tips flow

#### 🔧 **AI Integration**
- **Google Gemini API**: High-performance AI service with 1,500 requests/day free tier
- **Reliable Processing**: Production-ready error handling and service monitoring
- **Transparent Processing**: Provider information displayed with results

## Technology Stack

### Frontend
- **Vue.js 3** with Composition API and TypeScript
- **Tailwind CSS** for utility-first styling and responsive design
- **Vue Router** for SPA navigation
- **Vue I18n** for internationalization (Japanese/English)
- **Pinia** for state management
- **Vite** for fast development and optimized production builds
- **Axios** for API communication with comprehensive error handling

### Backend
- **Node.js** with Express.js framework
- **Google Gemini API** for AI-powered text processing
- **Robust Error Handling**: Comprehensive service monitoring and user feedback
- **Winston** for structured logging and monitoring
- **Express Validator** for request validation and security

### Infrastructure
- **Vercel Ready** deployment configuration with serverless functions
- **Environment-based Configuration** for different deployment targets
- **Health Check Endpoints** for monitoring and diagnostics

## Quick Start

### Prerequisites
- Node.js 18+ (recommended: 22+)
- Google Gemini API key (free tier available)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/M-Ito-7310/text-summarizer.git
   cd text-summarizer
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend && npm install
   
   # Install backend dependencies
   cd ../backend && npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create .env file in project root
   cp .env.example .env
   
   # Add your Google Gemini API key
   GOOGLE_API_KEY=your_api_key_here
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1: Backend
   cd backend && npm start
   
   # Terminal 2: Frontend  
   cd frontend && npm run dev
   ```

5. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

## API Documentation

### Full Text Analysis
```http
POST /api/text/analyze
Content-Type: application/json

{
  "text": "Your text to analyze...",
  "summaryOptions": {
    "maxLength": 200,
    "minLength": 50
  },
  "keywordOptions": {
    "maxKeywords": 10
  }
}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "summary": {
      "text": "Generated summary...",
      "provider": "Gemini",
      "method": "abstractive"
    },
    "keywords": {
      "list": [
        {
          "word": "keyword",
          "score": 0.95,
          "frequency": 5,
          "type": "word"
        }
      ],
      "provider": "Gemini"
    }
  },
  "metadata": {
    "processingTime": 1234,
    "characterCount": 500
  }
}
```

### Additional Endpoints
- `GET /health` - Health check
- `GET /api/text/services/status` - AI service status  
- `POST /api/text/services/configure` - AI service configuration
- `POST /api/text/summarize` - Summarization only
- `POST /api/text/keywords` - Keyword extraction only
- `GET /api/file/info` - File upload information
- `POST /api/file/upload` - File upload and processing
- `POST /api/file/analyze` - Direct file analysis

## Development

### Backend Development
```bash
cd backend
npm run dev          # Development server with hot reload
npm test            # Run test suite
npm run lint        # Code linting
```

### Frontend Development
```bash
cd frontend
npm run dev         # Development server
npm run build       # Production build
npm run preview     # Preview production build
```

### Project Structure
```
text-summarizer/
├── frontend/                 # Vue.js frontend application
│   ├── src/
│   │   ├── components/     # Vue components
│   │   │   ├── Input/     # Text input and file upload
│   │   │   ├── Results/   # Analysis results display
│   │   │   ├── History/   # Processing history
│   │   │   ├── Layout/    # App layout components
│   │   │   └── UI/        # Reusable UI components
│   │   ├── stores/        # Pinia state management
│   │   ├── locales/       # I18n translation files
│   │   ├── views/         # Page components
│   │   ├── router/        # Vue Router configuration
│   │   └── App.vue        # Main application
│   └── package.json
├── backend/                  # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   │   └── ai/        # AI service integration
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/        # Configuration files
│   │   └── utils/          # Utilities and logging
│   └── package.json
├── vercel.json              # Deployment configuration
└── README.md
```

## Configuration

### Required Environment Variables
```env
# AI Service Configuration
GOOGLE_API_KEY=your_google_gemini_api_key

# Application Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Optional Configuration
```env
# Database Configuration (for future features)
DATABASE_URL=postgresql://...
DB_HOST=localhost
DB_PORT=5432
DB_NAME=text_summarizer
DB_USER=postgres
DB_PASSWORD=password
```

## AI Service Details

### Google Gemini Integration
- **Model**: gemini-1.5-flash
- **Free Tier**: 1,500 requests per day
- **Capabilities**: Abstractive summarization, keyword extraction
- **Languages**: Optimized for Japanese and English
- **Response Time**: 1-3 seconds typical
- **Reliability**: Production-ready with comprehensive error handling

## Performance & Monitoring

### Performance Metrics
- **API Response Time**: 1-3 seconds (AI processing)
- **Frontend Bundle Size**: Optimized for fast loading
- **Japanese Text Processing**: Google Gemini optimized for accuracy

### Monitoring Features
- **Structured Logging**: Winston-based logging system with request/response tracking
- **Health Check Endpoints**: `/health` for uptime monitoring, service status endpoints
- **Error Tracking**: Comprehensive error handling and debugging
- **API Usage Metrics**: Local tracking of processing statistics

## Security

### API Security
- **Input Validation**: express-validator for comprehensive request validation
- **Rate Limiting**: Middleware to prevent abuse
- **CORS Configuration**: Secure cross-origin requests
- **Environment Protection**: Secure API key management

### Data Privacy
- **No Persistent Storage**: User text is not stored permanently
- **API Key Security**: Secure handling of sensitive credentials
- **Client-side Processing**: Where possible, processing done locally

## Deployment

### Vercel Deployment
The project is configured for one-click Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
- `GOOGLE_API_KEY`: Your Google Gemini API key
- `NODE_ENV`: Set to `production`
- `FRONTEND_URL`: Your frontend domain

### Development Workflow
- **Setup**: Clone repository, install dependencies, configure environment
- **Testing**: Backend tests with Jest, API integration tests, manual UI testing
- **Quality**: ESLint for code quality, TypeScript for frontend type safety
- **Deployment**: Automatic deployment on push to main, environment variables in Vercel, health check monitoring

## Future Roadmap

### Recently Completed (Latest Release)
- [x] **Language-Aware Text Processing**: Separate Japanese/English statistics and counting
- [x] **Enhanced PDF Export**: Multi-page PDF with original text on second page
- [x] **Summary Length Indicators**: Clear character count ranges for each length option
- [x] **Test File Integration**: Downloadable test-sample.txt for upload testing
- [x] **Improved UX Layout**: Optimized section ordering and button labeling

### Near Term (Phase 4)
- [ ] **Enhanced File Support**: PDF and DOCX processing (currently TXT only)
- [ ] **Advanced Export Options**: Markdown and JSON export formats
- [ ] **Batch Processing**: Multiple document processing capabilities
- [ ] **Keyword Search**: Interactive keyword filtering and search

### Medium Term
- [ ] **User Authentication**: Account system with saved documents
- [ ] **Multi-document Analysis**: Document comparison and batch analysis
- [ ] **Advanced AI Features**: Sentiment analysis, entity recognition
- [ ] **Real-time Collaboration**: Shared processing and results

### Long Term
- [ ] **Multi-language UI**: International language support
- [ ] **Integration Expansion**: Additional AI providers and services
- [ ] **Custom Model Support**: Fine-tuning and specialized models
- [ ] **Enterprise Features**: Organization accounts, usage analytics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code patterns and architecture
- Ensure comprehensive error handling
- Add appropriate logging for debugging
- Test AI processing and error scenarios
- Update documentation for new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Open an issue on GitHub
- Check the project documentation
- Review the API examples above
- Consult the [ROADMAP.md](ROADMAP.md) for planned features