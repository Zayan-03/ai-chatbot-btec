# AI Chatbot - BTEC Level 3 IT Diploma

A comprehensive full-stack AI chatbot application built for the Pearson BTEC Level 3 IT Diploma assignment. This project demonstrates modern web development practices, AI integration, and database management.

## 🌟 Features

### Core Functionality
- ✅ **AI-Powered Conversations** - Powered by OpenAI GPT API
- ✅ **User Authentication** - JWT-based auth with secure password hashing
- ✅ **Chat History** - Persistent storage of conversations
- ✅ **Multiple Conversations** - Create and manage multiple chat threads
- ✅ **File Uploads** - Upload documents and images for context
- ✅ **Streaming Responses** - Real-time response streaming
- ✅ **Message Search** - Search through conversation history
- ✅ **User Profiles** - Customizable user settings
- ✅ **Export Chats** - Download conversations as PDF/JSON
- ✅ **Real-time Updates** - WebSocket support for live messaging

### Technical Features
- ✅ **Responsive UI** - Works on desktop, tablet, and mobile
- ✅ **Dark/Light Mode** - Theme toggle
- ✅ **Rate Limiting** - Prevent API abuse
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Logging** - Activity tracking and debugging
- ✅ **Database** - SQLite with secure queries
- ✅ **API Documentation** - OpenAPI/Swagger specs
- ✅ **Testing** - Unit and integration tests

## 📋 Project Structure

```
ai-chatbot-btec/
├── server/                 # Backend (Node.js/Express)
│   ├── routes/            # API endpoints
│   ├── models/            # Database schemas
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth, validation, etc.
│   ├── utils/             # Helper functions
│   ├── config/            # Configuration files
│   └── index.js           # Server entry point
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Helper functions
│   │   ├── styles/        # CSS/styling
│   │   └── App.jsx        # Main app component
│   └── public/
├── docs/                  # Documentation
├── tests/                 # Test files
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zayan-03/ai-chatbot-btec.git
   cd ai-chatbot-btec
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run setup
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your credentials:
   ```
   OPENAI_API_KEY=your_api_key_here
   JWT_SECRET=your_jwt_secret
   DATABASE_URL=./data/chatbot.db
   PORT=5000
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

   - **Frontend**: http://localhost:3000
   - **Backend**: http://localhost:5000
   - **API Docs**: http://localhost:5000/api/docs

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Conversations
- `GET /api/conversations` - List user's conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/:id` - Get conversation details
- `PUT /api/conversations/:id` - Update conversation
- `DELETE /api/conversations/:id` - Delete conversation

### Messages
- `GET /api/conversations/:id/messages` - Get messages in conversation
- `POST /api/conversations/:id/messages` - Send message (with streaming)
- `DELETE /api/messages/:id` - Delete message
- `PUT /api/messages/:id` - Edit message

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files/:id` - Get file info
- `DELETE /api/files/:id` - Delete file

### User Settings
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/settings` - Update settings
- `POST /api/users/password` - Change password

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **CORS** - Cross-origin resource sharing configured
- **Rate Limiting** - API rate limiting per user
- **Input Validation** - All inputs validated and sanitized
- **SQL Injection Protection** - Parameterized queries
- **XSS Protection** - Content Security Policy headers
- **Environment Variables** - Sensitive data in .env files

## 🧪 Testing

Run tests with:
```bash
npm run test
```

Run with coverage:
```bash
npm run test:coverage
```

## 📖 Documentation

See the `docs/` folder for:
- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (with TypeORM)
- **Authentication**: JWT
- **API**: OpenAI GPT
- **WebSocket**: Socket.io
- **Validation**: Joi
- **Testing**: Jest

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: Context API / Zustand
- **Form Handling**: React Hook Form
- **Real-time**: Socket.io Client
- **Testing**: React Testing Library

## 📱 Features Breakdown

### Authentication
- User registration with email validation
- Secure login with JWT tokens
- Password reset functionality
- Social login integration (Google, GitHub)

### Chat Management
- Create unlimited conversations
- Organize chats with custom titles
- Pin important conversations
- Archive old conversations
- Share conversations via links

### Message Features
- Real-time message streaming
- Message editing and deletion
- Markdown support
- Code syntax highlighting
- Message reactions/ratings
- Retry failed messages

### File Handling
- Upload images, PDFs, documents
- Automatic file type validation
- File size limits
- Image preview in chat
- Extract text from documents

### User Settings
- Dark/Light theme
- Font size preferences
- Auto-save settings
- API key management
- Notification preferences
- Account security settings

## 🌐 Deployment

See [Deployment Guide](docs/DEPLOYMENT.md) for:
- Heroku deployment
- AWS deployment
- Docker containerization
- Environment setup for production

## 📝 License

MIT License - feel free to use this for your BTEC assignment!

## 🤝 Support

For issues or questions, please open a GitHub issue or check the documentation.

---

**Built with ❤️ for BTEC Level 3 IT Diploma**
