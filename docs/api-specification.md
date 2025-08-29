# API Specification Design

## Overview

FitnessTracker RESTful API follows OpenAPI 3.0 specification with consistent design patterns, proper HTTP status codes, and comprehensive error handling.

**Base URL**: `http://localhost:8080/api`  
**API Version**: v1  
**Authentication**: JWT Bearer Token

## API Design Principles

1. **RESTful Design**: Resource-based URLs with standard HTTP methods
2. **Consistent Response Format**: Standardized success/error response structure
3. **Stateless**: JWT-based authentication without server-side sessions
4. **Idempotent Operations**: Safe retry mechanisms for non-GET requests
5. **Pagination**: Consistent pagination for list endpoints
6. **Versioning**: URL-based versioning for future compatibility

## Authentication Flow

```
POST /api/auth/register → User Registration
POST /api/auth/login → JWT Token Generation
GET /api/auth/me → Token Validation & User Info
POST /api/auth/refresh → Token Refresh
POST /api/auth/logout → Token Invalidation
```

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    // Resource data
  },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "content": [
      // Array of resources
    ],
    "pagination": {
      "page": 1,
      "size": 20,
      "totalElements": 150,
      "totalPages": 8,
      "first": true,
      "last": false
    }
  }
}
```

## API Endpoints Specification

### 1. Authentication Module (`/api/auth`)

#### POST /api/auth/register
**Description**: Register a new user account

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe",
  "dateOfBirth": "1990-01-15",
  "gender": "MALE",
  "height": 175.5,
  "activityLevel": "MODERATELY_ACTIVE"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "dateOfBirth": "1990-01-15",
      "gender": "MALE",
      "height": 175.5,
      "activityLevel": "MODERATELY_ACTIVE",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 86400
    }
  }
}
```

#### POST /api/auth/login
**Description**: Authenticate user and generate JWT tokens

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 86400
    }
  }
}
```

#### GET /api/auth/me
**Description**: Get current user information  
**Authorization**: Bearer Token Required

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "dateOfBirth": "1990-01-15",
    "gender": "MALE",
    "height": 175.5,
    "activityLevel": "MODERATELY_ACTIVE"
  }
}
```

### 2. Exercise Management (`/api/exercises`)

#### GET /api/exercises
**Description**: Get paginated list of exercises  
**Authorization**: Bearer Token Required

**Query Parameters**:
- `page` (int, default: 0): Page number
- `size` (int, default: 20): Page size
- `category` (string, optional): Filter by category
- `muscleGroups` (string[], optional): Filter by muscle groups
- `search` (string, optional): Search by name

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Push-ups",
        "category": "STRENGTH",
        "muscleGroups": ["CHEST", "ARMS", "CORE"],
        "instructions": "Start in plank position...",
        "difficultyLevel": "BEGINNER",
        "equipmentNeeded": ["BODYWEIGHT"],
        "isDefault": true
      }
    ],
    "pagination": {
      "page": 0,
      "size": 20,
      "totalElements": 50,
      "totalPages": 3
    }
  }
}
```

#### POST /api/exercises
**Description**: Create a custom exercise  
**Authorization**: Bearer Token Required

**Request Body**:
```json
{
  "name": "Custom Push-ups",
  "category": "STRENGTH",
  "muscleGroups": ["CHEST", "ARMS"],
  "instructions": "Modified push-up variation...",
  "difficultyLevel": "INTERMEDIATE",
  "equipmentNeeded": ["BODYWEIGHT"]
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": 101,
    "name": "Custom Push-ups",
    "category": "STRENGTH",
    "muscleGroups": ["CHEST", "ARMS"],
    "instructions": "Modified push-up variation...",
    "difficultyLevel": "INTERMEDIATE",
    "equipmentNeeded": ["BODYWEIGHT"],
    "isDefault": false,
    "createdBy": 1,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Workout Management (`/api/workouts`)

#### GET /api/workouts/sessions
**Description**: Get user's workout sessions  
**Authorization**: Bearer Token Required

**Query Parameters**:
- `page` (int, default: 0): Page number
- `size` (int, default: 20): Page size
- `startDate` (date, optional): Filter from date
- `endDate` (date, optional): Filter to date

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Morning Workout",
        "sessionDate": "2024-01-15",
        "durationMinutes": 60,
        "totalVolume": 2500.00,
        "notes": "Great session today!",
        "recordsCount": 5,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 0,
      "size": 20,
      "totalElements": 25,
      "totalPages": 2
    }
  }
}
```

#### POST /api/workouts/sessions
**Description**: Create a new workout session  
**Authorization**: Bearer Token Required

**Request Body**:
```json
{
  "name": "Evening Workout",
  "sessionDate": "2024-01-15",
  "notes": "Focus on upper body"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Evening Workout",
    "sessionDate": "2024-01-15",
    "durationMinutes": 0,
    "totalVolume": 0.00,
    "notes": "Focus on upper body",
    "createdAt": "2024-01-15T18:30:00Z"
  }
}
```

#### GET /api/workouts/sessions/{sessionId}/records
**Description**: Get workout records for a session  
**Authorization**: Bearer Token Required

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "exercise": {
        "id": 1,
        "name": "Push-ups",
        "category": "STRENGTH"
      },
      "sets": 3,
      "reps": 15,
      "weight": null,
      "distance": null,
      "durationMinutes": null,
      "caloriesBurned": 50,
      "notes": "Good form maintained",
      "createdAt": "2024-01-15T10:35:00Z"
    }
  ]
}
```

#### POST /api/workouts/sessions/{sessionId}/records
**Description**: Add workout record to session  
**Authorization**: Bearer Token Required

**Request Body**:
```json
{
  "exerciseId": 1,
  "sets": 3,
  "reps": 12,
  "weight": 70.5,
  "notes": "Increased weight from last session"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "exercise": {
      "id": 1,
      "name": "Bench Press",
      "category": "STRENGTH"
    },
    "sets": 3,
    "reps": 12,
    "weight": 70.5,
    "notes": "Increased weight from last session",
    "createdAt": "2024-01-15T10:40:00Z"
  }
}
```

### 4. Goal Management (`/api/goals`)

#### GET /api/goals
**Description**: Get user's goals  
**Authorization**: Bearer Token Required

**Query Parameters**:
- `status` (string, optional): Filter by status (ACTIVE, COMPLETED, PAUSED, CANCELLED)
- `goalType` (string, optional): Filter by goal type

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Lose 10kg",
      "description": "Weight loss goal for summer",
      "goalType": "WEIGHT_LOSS",
      "targetValue": 10.0,
      "currentValue": 3.5,
      "unit": "kg",
      "targetDate": "2024-06-01",
      "status": "ACTIVE",
      "progressPercentage": 35.0,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/goals
**Description**: Create a new goal  
**Authorization**: Bearer Token Required

**Request Body**:
```json
{
  "title": "Bench Press 100kg",
  "description": "Increase bench press to 100kg",
  "goalType": "STRENGTH",
  "targetValue": 100.0,
  "unit": "kg",
  "targetDate": "2024-12-31"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Bench Press 100kg",
    "description": "Increase bench press to 100kg",
    "goalType": "STRENGTH",
    "targetValue": 100.0,
    "currentValue": 0.0,
    "unit": "kg",
    "targetDate": "2024-12-31",
    "status": "ACTIVE",
    "progressPercentage": 0.0,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 5. Statistics & Analytics (`/api/statistics`)

#### GET /api/statistics/overview
**Description**: Get user's fitness overview statistics  
**Authorization**: Bearer Token Required

**Query Parameters**:
- `period` (string, default: "1M"): Time period (1W, 1M, 3M, 6M, 1Y)

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "period": "1M",
    "totalWorkouts": 12,
    "totalExercises": 45,
    "totalVolume": 12500.0,
    "averageSessionDuration": 65,
    "mostFrequentExercise": "Push-ups",
    "strongestLift": {
      "exerciseName": "Bench Press",
      "maxWeight": 75.0
    },
    "goalProgress": [
      {
        "goalId": 1,
        "title": "Lose 10kg",
        "progressPercentage": 35.0
      }
    ]
  }
}
```

#### GET /api/statistics/progress/{exerciseId}
**Description**: Get exercise progress over time  
**Authorization**: Bearer Token Required

**Query Parameters**:
- `period` (string, default: "3M"): Time period for data

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "exerciseId": 1,
    "exerciseName": "Bench Press",
    "dataPoints": [
      {
        "date": "2024-01-01",
        "maxWeight": 65.0,
        "totalVolume": 1950.0,
        "totalReps": 30
      },
      {
        "date": "2024-01-08",
        "maxWeight": 67.5,
        "totalVolume": 2025.0,
        "totalReps": 30
      }
    ]
  }
}
```

### 6. Body Composition (`/api/body-composition`)

#### GET /api/body-composition
**Description**: Get user's body composition history  
**Authorization**: Bearer Token Required

**Query Parameters**:
- `startDate` (date, optional): Filter from date
- `endDate` (date, optional): Filter to date
- `limit` (int, default: 50): Maximum number of records

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "weight": 75.5,
      "bodyFat": 15.2,
      "muscleMass": 35.8,
      "measurementDate": "2024-01-15",
      "notes": "Morning measurement",
      "createdAt": "2024-01-15T08:00:00Z"
    }
  ]
}
```

#### POST /api/body-composition
**Description**: Record body composition measurement  
**Authorization**: Bearer Token Required

**Request Body**:
```json
{
  "weight": 74.8,
  "bodyFat": 14.9,
  "muscleMass": 36.1,
  "measurementDate": "2024-01-16",
  "notes": "After workout"
}
```

**Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "weight": 74.8,
    "bodyFat": 14.9,
    "muscleMass": 36.1,
    "measurementDate": "2024-01-16",
    "notes": "After workout",
    "createdAt": "2024-01-16T18:30:00Z"
  }
}
```

## Error Handling

### HTTP Status Codes

- **200 OK**: Successful GET request
- **201 Created**: Successful POST request
- **204 No Content**: Successful DELETE request
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict (e.g., duplicate email)
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server error

### Standard Error Codes

```json
{
  "VALIDATION_ERROR": "Invalid input data",
  "AUTHENTICATION_FAILED": "Invalid credentials",
  "TOKEN_EXPIRED": "JWT token has expired",
  "RESOURCE_NOT_FOUND": "Requested resource not found",
  "DUPLICATE_RESOURCE": "Resource already exists",
  "INSUFFICIENT_PERMISSIONS": "Access denied",
  "BUSINESS_RULE_VIOLATION": "Business rule validation failed",
  "EXTERNAL_SERVICE_ERROR": "External service unavailable",
  "RATE_LIMIT_EXCEEDED": "Too many requests"
}
```

## Rate Limiting

- **General API**: 1000 requests per hour per user
- **Authentication**: 10 login attempts per 15 minutes per IP
- **File Upload**: 50 requests per hour per user

## Security Considerations

1. **Input Validation**: All inputs validated against schema
2. **SQL Injection**: Parameterized queries with JPA
3. **XSS Protection**: Response sanitization
4. **CORS**: Configured for frontend domain
5. **HTTPS**: Enforced in production
6. **JWT Security**: Proper token validation and refresh

## API Versioning Strategy

- **URL Versioning**: `/api/v1/` prefix for version 1
- **Backward Compatibility**: Maintain previous versions
- **Deprecation Policy**: 6-month deprecation notice
- **Version Headers**: Optional `API-Version` header support

This API specification provides a comprehensive foundation for the FitnessTracker application with consistent patterns, proper error handling, and security best practices.