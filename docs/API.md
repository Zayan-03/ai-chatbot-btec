# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "securePassword123!"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "username": "username"
  },
  "token": "jwt_token_here"
}
```

#### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "username": "username"
  },
  "token": "jwt_token_here"
}
```

#### Get Current User

```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "username": "username",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### Logout User

```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Conversation Endpoints

#### List All Conversations

```http
GET /conversations?limit=10&offset=0
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "conv-uuid",
      "title": "Project Discussion",
      "description": "Discussing the new project setup",
      "message_count": 15,
      "is_pinned": false,
      "is_archived": false,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T15:45:00Z"
    }
  ],
  "total": 1
}
```

#### Create New Conversation

```http
POST /conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Project Discussion",
  "description": "Discussing the new project setup"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "conv-uuid",
    "title": "Project Discussion",
    "description": "Discussing the new project setup",
    "message_count": 0,
    "is_pinned": false,
    "is_archived": false,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### Get Conversation Details

```http
GET /conversations/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "conv-uuid",
    "title": "Project Discussion",
    "description": "Discussing the new project setup",
    "messages": [
      {
        "id": "msg-uuid",
        "content": "Hello, how are you?",
        "role": "user",
        "created_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### Update Conversation

```http
PUT /conversations/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "is_pinned": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "conv-uuid",
    "title": "Updated Title",
    "description": "Updated description",
    "is_pinned": true
  }
}
```

#### Delete Conversation

```http
DELETE /conversations/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

### Message Endpoints

#### Send Message (with AI Response)

```http
POST /conversations/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "What is artificial intelligence?",
  "file_ids": ["file-uuid"] // optional
}
```

**Response (200 - Streaming):**
```
data: {"id":"msg-uuid","content":"Artificial","role":"assistant"}
data: {"id":"msg-uuid","content":" intelligence","role":"assistant"}
data: {"id":"msg-uuid","content":" is...","role":"assistant"}
```

#### Get Messages in Conversation

```http
GET /conversations/:id/messages?limit=50&offset=0
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "msg-uuid",
      "conversation_id": "conv-uuid",
      "content": "Hello!",
      "role": "user",
      "created_at": "2024-01-15T10:30:00Z",
      "edited_at": null
    },
    {
      "id": "msg-uuid-2",
      "conversation_id": "conv-uuid",
      "content": "Hello! How can I help you?",
      "role": "assistant",
      "created_at": "2024-01-15T10:30:05Z",
      "edited_at": null
    }
  ],
  "total": 2
}
```

#### Edit Message

```http
PUT /messages/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated message content"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "msg-uuid",
    "content": "Updated message content",
    "edited_at": "2024-01-15T10:35:00Z"
  }
}
```

#### Delete Message

```http
DELETE /messages/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

### File Endpoints

#### Upload File

```http
POST /files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

File: <binary-file-data>
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "file-uuid",
    "filename": "document.pdf",
    "file_type": "application/pdf",
    "file_size": 2048000,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### Get File Info

```http
GET /files/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "file-uuid",
    "filename": "document.pdf",
    "file_type": "application/pdf",
    "file_size": 2048000,
    "created_at": "2024-01-15T10:30:00Z",
    "url": "/api/files/file-uuid/download"
  }
}
```

#### Delete File

```http
DELETE /files/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### User Endpoints

#### Get User Profile

```http
GET /users/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "username": "username",
    "avatar_url": "https://example.com/avatar.jpg",
    "bio": "I love AI!",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### Update User Profile

```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newusername",
  "bio": "Updated bio",
  "avatar_url": "https://example.com/new-avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "username": "newusername",
    "bio": "Updated bio"
  }
}
```

#### Update User Settings

```http
PUT /users/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "theme": "dark",
  "notifications_enabled": true,
  "font_size": "medium"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "theme": "dark",
    "notifications_enabled": true,
    "font_size": "medium"
  }
}
```

#### Change Password

```http
POST /users/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_password": "oldPassword123!",
  "new_password": "newPassword456!",
  "confirm_password": "newPassword456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid input",
  "code": "INVALID_INPUT",
  "details": { "field": "error message" }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized",
  "code": "UNAUTHORIZED"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Access denied",
  "code": "FORBIDDEN"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found",
  "code": "NOT_FOUND"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "code": "RATE_LIMITED"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "code": "SERVER_ERROR"
}
```

## Rate Limiting

The API implements rate limiting:
- **100 requests per 15 minutes** per user
- Rate limit headers in response:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1642254600
  ```

## Pagination

List endpoints support pagination:
- `limit` (default: 20, max: 100)
- `offset` (default: 0)

Example:
```http
GET /conversations?limit=10&offset=20
```

## Sorting

List endpoints support sorting:
- `sort` field name (e.g., `created_at`, `updated_at`)
- `order` asc or desc (default: desc)

Example:
```http
GET /conversations?sort=created_at&order=asc
```
