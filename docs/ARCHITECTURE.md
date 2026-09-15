# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (React)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Pages      │  │ Components   │  │    Hooks     │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                 │                │
│         └─────────────────┴─────────────────┘                │
│                        │                                     │
│                  Axios / Socket.io                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP/WebSocket
                         │
┌────────────────────────┴────────────────────────────────────┐
│                  SERVER (Express.js)                        │
│                                                              │
│  ┌──────────────┬──────────────┬──────────────┐             │
│  │   Routes     │ Controllers  │  Middleware  │             │
│  └──────┬───────┴──────┬───────┴──────┬───────┘             │
│         │              │              │                     │
│  ┌──────┴──────────────┴──────────────┘                     │
│  │                                                           │
│  │  ┌─────────────┐    ┌──────────────┐                    │
│  │  │  Services   │    │    Utils     │                    │
│  │  └──────┬──────┘    └──────┬───────┘                    │
│  │         │                  │                            │
│  │  ┌──────┴──────────────────┘                            │
│  │  │                                                       │
│  └──┴─────────────────────────────────────────────────────┘
│         │
│    ┌────┴─────────────┐
│    │                  │
│    ▼                  ▼
│ ┌────────┐      ┌──────────────┐
│ │Database│      │OpenAI API    │
│ │(SQLite)│      │(GPT-3.5-turbo)│
│ └────────┘      └──────────────┘
└────────────────────────────────────────────────────────────┘
```

## Directory Structure

### Backend (`/server`)

```
server/
├── config/
│   ├── database.js        # Database setup
│   └── openai.js          # OpenAI configuration
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── chatController.js  # Chat logic
│   ├── messageController.js
│   ├── fileController.js  # File handling
│   └── userController.js
├── middleware/
│   ├── auth.js            # JWT verification
│   ├── validation.js      # Input validation
│   ├── errorHandler.js    # Error handling
│   └── logger.js          # Request logging
├── models/
│   ├── User.js            # User schema
│   ├── Conversation.js    # Chat schema
│   ├── Message.js         # Message schema
│   └── File.js            # File schema
├── routes/
│   ├── auth.js            # Auth endpoints
│   ├── chats.js           # Chat endpoints
│   ├── messages.js        # Message endpoints
│   ├── files.js           # File endpoints
│   └── users.js           # User endpoints
├── utils/
│   ├── aiService.js       # OpenAI integration
│   ├── fileHandler.js     # File processing
│   ├── emailService.js    # Email sending
│   └── validators.js      # Input validators
├── data/
│   └── chatbot.db         # SQLite database (created on init)
├── logs/
│   └── app.log            # Application logs
├── index.js               # Server entry point
└── package.json
```

### Frontend (`/client`)

```
client/
├── src/
│   ├── components/
│   │   ├── ChatWindow.jsx     # Main chat interface
│   │   ├── MessageList.jsx    # Messages display
│   │   ├── InputBox.jsx       # Message input
│   │   ├── SideBar.jsx        # Conversation list
│   │   ├── Header.jsx         # Top navigation
│   │   └── Settings.jsx       # User settings
│   ├── pages/
│   │   ├── Login.jsx          # Login page
│   │   ├── Register.jsx       # Registration page
│   │   ├── Dashboard.jsx      # Main dashboard
│   │   └── Profile.jsx        # User profile
│   ├── hooks/
│   │   ├── useAuth.js         # Auth context hook
│   │   ├── useChat.js         # Chat logic hook
│   │   └── useSocket.js       # WebSocket hook
│   ├── utils/
│   │   ├── api.js             # API client
│   │   ├── storage.js         # Local storage
│   │   └── formatting.js      # Text formatting
│   ├── styles/
│   │   ├── App.css            # Global styles
│   │   └── tailwind.config.js # Tailwind config
│   ├── App.jsx                # Main app component
│   └── index.jsx              # Entry point
├── public/
│   └── index.html
└── package.json
```

## Data Flow

### User Authentication

```
User Input (email, password)
         │
         ▼
   Validation
         │
         ▼
  Send to /auth/login
         │
         ▼
   Verify Credentials
         │
         ▼
   Generate JWT Token
         │
         ▼
   Return Token + User Data
         │
         ▼
   Store Token (localStorage)
         │
         ▼
   Redirect to Dashboard
```

### Message Flow

```
User Types Message
         │
         ▼
   Local Validation
         │
         ▼
   Display in Chat
         │
         ▼
   Send to /messages/send
         │
         ▼
   Save to Database
         │
         ▼
   Call OpenAI API (streaming)
         │
         ▼
   Stream Response to Client
         │
         ▼
   Save AI Response to DB
         │
         ▼
   Display in Chat
```

### File Upload Flow

```
User Selects File
         │
         ▼
   Client-side Validation
         │
         ▼
   Read File Content
         │
         ▼
   Send to /files/upload
         │
         ▼
   Server Validation
         │
         ▼
   Save to Disk
         │
         ▼
   Save Metadata to DB
         │
         ▼
   Return File Info
         │
         ▼
   Attach to Conversation
```

## Database Schema

### Users Table
```sql
users {
  id: UUID PRIMARY KEY
  email: VARCHAR UNIQUE
  username: VARCHAR
  password_hash: VARCHAR
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

### Conversations Table
```sql
conversations {
  id: UUID PRIMARY KEY
  user_id: UUID FOREIGN KEY
  title: VARCHAR
  description: TEXT
  is_pinned: BOOLEAN
  is_archived: BOOLEAN
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

### Messages Table
```sql
messages {
  id: UUID PRIMARY KEY
  conversation_id: UUID FOREIGN KEY
  user_id: UUID FOREIGN KEY
  content: TEXT
  role: ENUM (user, assistant)
  created_at: TIMESTAMP
  edited_at: TIMESTAMP
}
```

### Files Table
```sql
files {
  id: UUID PRIMARY KEY
  conversation_id: UUID FOREIGN KEY
  user_id: UUID FOREIGN KEY
  filename: VARCHAR
  file_type: VARCHAR
  file_size: INTEGER
  file_path: VARCHAR
  created_at: TIMESTAMP
}
```

## API Communication

All API endpoints follow RESTful conventions:

- `GET` - Retrieve data
- `POST` - Create data
- `PUT` - Update data
- `DELETE` - Delete data

Response format:
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Operation successful"
}
```

Error format:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Security Architecture

```
┌─────────────────┐
│  CORS Middleware│
└────────┬────────┘
         │
┌────────▼────────┐
│ Rate Limiter    │
└────────┬────────┘
         │
┌────────▼────────┐
│ Auth Middleware │
│ (JWT Verify)    │
└────────┬────────┘
         │
┌────────▼────────┐
│  Validation     │
│  (Input checks) │
└────────┬────────┘
         │
┌────────▼────────┐
│   Controller    │
│   Processing    │
└────────┬────────┘
         │
┌────────▼────────┐
│  Error Handler  │
└─────────────────┘
```
