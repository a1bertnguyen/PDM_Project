# API Documentation

## Base URLs
- Development: `http://localhost:2005` (Gateway)
- Production: `[Production URL]`

## Authentication Endpoints

### Sign In
```
POST /auth/signin
```
**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "jwt": "string",
  "message": "string",
  "status": boolean
}
```

### Sign Up
```
POST /auth/signup
```
**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "fullName": "string",
  "role": "string"
}
```
**Response:**
```json
{
  "jwt": "string",
  "message": "string",
  "status": boolean
}
```

## User Profile Endpoints

### Get User Profile
```
GET /api/users/profile
```
**Headers:**
- Authorization: Bearer [token]

**Response:**
```json
{
  "id": "number",
  "email": "string",
  "fullName": "string",
  "role": "string"
}
```

## Task Endpoints

### Get All Tasks
```
GET /api/tasks
```
**Headers:**
- Authorization: Bearer [token]

**Query Parameters:**
- status (optional): PENDING | ASSIGNED | DONE
- sortByCreatedAt (optional): boolean
- sortByDeadline (optional): boolean

### Create Task
```
POST /api/tasks
```
**Headers:**
- Authorization: Bearer [token]

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "image": "string",
  "deadline": "datetime",
  "tags": ["string"]
}
```

### Update Task
```
PUT /api/tasks/{id}
```
**Headers:**
- Authorization: Bearer [token]

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "image": "string",
  "deadline": "datetime",
  "tags": ["string"],
  "status": "string"
}
```

### Delete Task
```
DELETE /api/tasks/{id}
```
**Headers:**
- Authorization: Bearer [token]

## Submission Endpoints

### Submit Task
```
POST /api/submissions
```
**Headers:**
- Authorization: Bearer [token]

**Query Parameters:**
- task_id: number
- github_link: string

### Get All Submissions
```
GET /api/submissions
```
**Headers:**
- Authorization: Bearer [token]

### Get Task Submissions
```
GET /api/submissions/task/{taskId}
```
**Headers:**
- Authorization: Bearer [token]

### Update Submission Status
```
PUT /api/submissions/{id}
```
**Headers:**
- Authorization: Bearer [token]

**Query Parameters:**
- status: string (ACCEPT/REJECT)
