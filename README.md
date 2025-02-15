# Web Scraper Chatbot

A powerful, production-ready web application that combines web scraping capabilities with AI-powered chat interactions. Built with modern technologies and a beautiful, responsive UI.

![Web Scraper Chatbot](https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=1600)

## Features

### Core Functionality
- **Web Scraping**
  - Real-time webpage content analysis
  - Efficient content extraction and processing
  - Async processing for better performance
  - Smart content caching

- **AI-Powered Chat**
  - Context-aware responses
  - Source citations with clickable links
  - Markdown support for formatted responses
  - Real-time chat interactions

### User Interface
- **Modern Design**
  - Clean, intuitive interface
  - Responsive layout for all devices
  - Beautiful animations and transitions
  - Professional typography and spacing

- **Dark/Light Theme**
  - System-aware theme detection
  - Smooth theme transitions
  - Consistent styling across modes
  - Accessible color contrasts

- **Chat Features**
  - Message timestamps
  - Copy message functionality
  - Multi-line input support
  - Real-time status indicators

### Data Management
- **Chat History**
  - Persistent conversation storage
  - URL-based history organization
  - Quick access to previous chats
  - Timestamp-based sorting

- **Export Functionality**
  - JSON export format
  - Complete conversation context
  - Metadata preservation
  - Formatted file naming

## Technology Stack

### Frontend
- **React 18**
  - Modern functional components
  - Custom hooks for state management
  - Efficient rendering with Strict Mode
  - TypeScript integration

- **Vite**
  - Lightning-fast development server
  - Optimized production builds
  - Hot Module Replacement (HMR)
  - Environment variable handling

- **TypeScript**
  - Strong type safety
  - Enhanced IDE support
  - Better code organization
  - Reduced runtime errors

- **Tailwind CSS**
  - Utility-first styling
  - Custom design system
  - Responsive design patterns
  - Dark mode support

### Backend & Database
- **Supabase**
  - Real-time database
  - Row Level Security (RLS)
  - Built-in authentication
  - Scalable infrastructure

### Libraries & Tools
- **lucide-react**
  - Beautiful, consistent icons
  - Optimized SVG components
  - Theme compatibility
  - Extensive icon set

- **date-fns**
  - Comprehensive date handling
  - Timezone support
  - Localization ready
  - Lightweight bundle

- **react-markdown**
  - Markdown rendering
  - Custom component mapping
  - Safe HTML handling
  - Link processing

### APIs & Services
- **OpenAI GPT-3.5**
  - Natural language processing
  - Context-aware responses
  - Source-based answers
  - Rate limiting support

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
git clone <repository-url>
cd web-scraper-chatbot

2. Install dependencies:
npm install

3. Set up environment variables:
cp .env.example .env

4. Update the .env file with your credentials:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_OPENAI_API_KEY=your_openai_key

1. Start the development server:
npm run dev

### Database Setup

1. Connect to Supabase:
   - Click "Connect to Supabase" button
   - Follow the authentication flow
   - Confirm database connection

2. Run migrations:
   - Migrations will automatically create:
     - scraped_content table
     - chat_sessions table
     - messages table
     - Required indexes and RLS policies

## Deployment

The application is configured for deployment on Netlify with the following features:
- Automatic HTTPS
- Continuous deployment
- Environment variable management
- Preview deployments

### Build Configuration
- Output directory: \`dist\`
- Build command: \`npm run build\`
- Node.js version: 18.x

## Security

### Data Protection
- Row Level Security (RLS) enabled
- Secure API key handling
- XSS prevention
- CORS configuration

### Authentication
- Supabase authentication
- Protected API routes
- Secure session management
- Rate limiting

## Performance

### Optimization Techniques
- Code splitting
- Asset optimization
- Caching strategies
- Lazy loading

### Monitoring
- Error tracking
- Performance metrics
- API usage monitoring
- User analytics

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for GPT-3.5 API
- Supabase for backend infrastructure
- React team for the framework
- Tailwind CSS for styling system



Developed by Ashvani S !!!!!