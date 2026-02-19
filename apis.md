# API Reference

Base URL prefix: `/api`

## Authentication

Protected routes require:
- Header: `Authorization: Bearer <accessToken>`

Role-restricted routes:
- `INSTRUCTOR` only:
  - `POST /api/sessions`
  - `POST /api/attendance/bulk`

Validation:
- Request validation uses Zod + shared `validate` middleware.
- On validation failure, API returns `400` with:
  - `message: "Validation failed"`
  - `errors: [{ field, message }]`

## 1. Auth APIs

### POST `/api/auth/register`
Register a new user.

Request body:
```json
{
  "email": "user@example.com",
  "password": "daisy123",
  "role": "STUDENT"
}
```

Validation:
- `email`: valid email
- `password`: min length 6
- `role`: `STUDENT | INSTRUCTOR`

Success (`201`):
```json
{
  "message": "User created successfully",
  "userId": 123
}
```

Errors:
- `400` email exists / validation failure
- `500` server error

### POST `/api/auth/login`
Authenticate and return access token + profile metadata.

Request body:
```json
{
  "email": "user@example.com",
  "password": "daisy123"
}
```

Validation:
- `email`: valid email
- `password`: required

Success (`200`):
```json
{
  "message": "Login successful",
  "accessToken": "<jwt>",
  "role": "STUDENT",
  "user_id": 10,
  "student_id": 14,
  "instructor_id": null,
  "profile": {
    "id": 14,
    "user_id": 10,
    "fullname": "Jane Doe",
    "phone_no": "0123456789"
  }
}
```

Errors:
- `401` invalid credentials
- `500` server error

## 2. Class APIs (Authenticated)

### GET `/api/classes/instructor/:instructorId`
Get classes by instructor profile id.

Path params:
- `instructorId`: positive integer

Success (`200`):
```json
{
  "classes": [
    {
      "id": 1,
      "name": "Class A",
      "subject": "Math",
      "instructor_id": 2,
      "instructor_user_id": 9,
      "instructor_name": "John Doe"
    }
  ]
}
```

### GET `/api/classes/student/:studentId`
Get classes enrolled by student profile id.

Path params:
- `studentId`: positive integer

Success (`200`):
- Same response shape as instructor classes (`{ classes: [...] }`)

### GET `/api/classes/user/:userId`
Get classes associated to a user id (as instructor or enrolled student).

Path params:
- `userId`: positive integer

Success (`200`):
- `{ classes: [...] }`

### GET `/api/classes/:classId/students`
Get all students in a class.

Path params:
- `classId`: positive integer

Success (`200`):
```json
{
  "students": [
    {
      "id": 14,
      "user_id": 10,
      "fullname": "Jane Doe",
      "phone_no": "0123456789",
      "email": "jane@example.com"
    }
  ]
}
```

### GET `/api/classes/:classId/attendance-summary`
Get attendance summary per student for a class.

Path params:
- `classId`: positive integer

Success (`200`):
```json
{
  "class_id": 1,
  "students": [
    {
      "student_id": 14,
      "fullname": "Jane Doe",
      "email": "jane@example.com",
      "phone_no": "0123456789",
      "attended_sessions": 7,
      "total_sessions": 10,
      "present_attendance_percentage": 70.0
    }
  ]
}
```

Common errors for class APIs:
- `400` invalid path params / validation failure
- `401` missing/invalid token
- `500` server error

## 3. Session APIs (Authenticated)

### GET `/api/sessions/:classId`
Get all sessions for a class.

Path params:
- `classId`: positive integer

Success (`200`):
```json
{
  "sessions": [
    {
      "id": 11,
      "class_id": 1,
      "name": "Week 1",
      "description": "Introduction",
      "session_date": "2026-02-01",
      "duration": 60,
      "start_time": "09:00:00",
      "end_time": "10:00:00"
    }
  ]
}
```

### POST `/api/sessions` (INSTRUCTOR only)
Create a class session.

Request body:
```json
{
  "class_id": 1,
  "name": "Week 2",
  "description": "Chapter 1",
  "session_date": "2026-02-20",
  "duration": 60,
  "start_time": "09:00"
}
```

Validation:
- `class_id`: positive integer
- `name`: non-empty string
- `description`: optional string/null
- `session_date`: `YYYY-MM-DD`
- `duration`: positive integer
- `start_time`: optional; `HH:MM` or `HH:MM:SS` (or empty string)

Success (`201`):
```json
{
  "message": "Session created successfully",
  "session_id": 22
}
```

Errors:
- `400` validation or invalid data
- `401` missing/invalid token
- `403` role forbidden
- `404` class not found
- `500` server error

## 4. Attendance APIs (Authenticated)

### POST `/api/attendance/bulk` (INSTRUCTOR only)
Upsert attendance for a session in bulk.

Request body:
```json
{
  "session_id": 22,
  "attendance": [
    { "student_id": 14, "status": "PRESENT" },
    { "student_id": 15, "status": "ABSENT" }
  ]
}
```

Validation:
- `session_id`: positive integer
- `attendance`: non-empty array
- `attendance[].student_id`: positive integer
- `attendance[].status`: `PRESENT | ABSENT | LATE`

Behavior notes:
- Duplicate student entries in the array are deduplicated (last one wins).
- Students must belong to the session's class.
- Uses DB upsert per `(session_id, student_id)`.

Success (`201`):
```json
{
  "message": "Attendance upserted successfully",
  "session_id": 22,
  "inserted_or_updated": 2
}
```

Errors:
- `400` validation or data mismatch
- `401` missing/invalid token
- `403` role forbidden
- `404` session not found
- `500` server error

### GET `/api/attendance/session/:sessionId`
Get session attendance grouped into present and absent student names.

Path params:
- `sessionId`: positive integer

Success (`200`):
```json
{
  "session_id": 22,
  "session": {
    "id": 22,
    "class_id": 1,
    "name": "Week 2",
    "description": "Chapter 1",
    "session_date": "2026-02-20",
    "duration": 60,
    "start_time": "09:00:00",
    "end_time": "10:00:00"
  },
  "present": ["Jane Doe"],
  "absent": ["Adam Smith"],
  "present_count": 1,
  "absent_count": 1
}
```

Errors:
- `400` invalid params / validation failure
- `401` missing/invalid token
- `404` session not found
- `500` server error
