# Setup Guide

## Prerequisites

- Node.js 16.0.0 or higher
- npm 7.0.0 or higher (or yarn)
- A text editor (VS Code recommended)
- OpenAI API key (get from https://platform.openai.com/api-keys)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Zayan-03/ai-chatbot-btec.git
cd ai-chatbot-btec
```

### 2. Install Server Dependencies

```bash
cd server
npm install
cd ..
```

### 3. Install Client Dependencies

```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```bash
# Open with your favorite editor
vim .env
# or
code .env
```

**Required variables:**
- `OPENAI_API_KEY` - Get from OpenAI dashboard
- `JWT_SECRET` - Generate a random string (min 32 characters)

### 5. Initialize Database

```bash
cd server
npm run db:init
cd ..
```

### 6. Start Development Server

**Option 1: Both services at once**
```bash
npm run dev
```

**Option 2: Separate terminals**

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run client
```

### 7. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/docs

## Getting OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in to your account
3. Click "Create new secret key"
4. Copy the key and paste it in your `.env` file as `OPENAI_API_KEY`
5. Save the key somewhere safe (you won't see it again!)

## Troubleshooting

### Port Already in Use

If port 5000 or 3000 is already in use:

```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

### Dependencies Issues

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

```bash
# Reset database
cd server
rm -f data/chatbot.db
npm run db:init
```

### OpenAI API Errors

- Check your API key is correct
- Verify your OpenAI account has credits
- Check rate limits in your OpenAI dashboard

## Running Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test -- auth.test.js
```

## Building for Production

```bash
# Build frontend
npm run build

# Start production server
NODE_ENV=production npm start
```

## Next Steps

1. Create your first account
2. Start a new conversation
3. Try uploading a file
4. Explore the API documentation
5. Check out the code in `server/` and `client/` folders
