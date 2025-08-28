# TextSummarizer Frontend

A modern, responsive Vue.js frontend for the AI-powered text summarization and keyword extraction tool.

## Features

### Core Functionality
- **Smart Text Analysis**: AI-powered summarization with customizable length options
- **Keyword Extraction**: Automatic identification of key terms and concepts
- **File Upload Support**: Direct analysis of TXT, PDF, and DOCX files
- **Real-time Processing**: Progress indicators and status updates

### User Experience
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Dark Mode Support**: Automatic detection and manual toggle
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Smooth Animations**: Subtle transitions and loading states

### Advanced Features
- **Analysis History**: Persistent storage of past analyses
- **Export Options**: PDF export and clipboard sharing
- **Interactive Keywords**: Visual keyword cloud with search functionality
- **Performance Analytics**: Word count, compression ratio, and processing stats

## Technology Stack

- **Vue.js 3**: Progressive JavaScript framework with Composition API
- **TypeScript**: Type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first styling with dark mode support
- **Pinia**: State management for complex application state
- **Vue Router**: Client-side routing with meta tag management
- **Lucide Icons**: Beautiful, consistent iconography
- **Axios**: HTTP client for API communication

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Integration

The frontend communicates with a Node.js backend via REST APIs:

- `POST /api/text/analyze` - Analyze text input
- `POST /api/text/analyze-file` - Analyze uploaded files
- `GET /api/health` - API health check

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
