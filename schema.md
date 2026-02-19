# Database Schema

This document describes the MySQL schema defined in `scripts/db/init.sql`.

## Overview

The system models:
- Users (`users`)
- Role profiles (`students`, `instructors`)
- Classes and enrollment (`classes`, `class_students`)
- Class sessions (`sessions`)
- Attendance records (`attendance`)

## Tables

### `users`
Stores login/auth identity.

Columns:
- `id` INT PK AUTO_INCREMENT
- `email` VARCHAR(150) UNIQUE NOT NULL
- `password` VARCHAR(255) NOT NULL
- `role` ENUM('STUDENT', 'INSTRUCTOR') NOT NULL
- `access_token` TEXT NULL
- `refresh_token` TEXT NULL
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Constraints:
- Unique: `email`

### `students`
Student profile tied 1:1 to a user.

Columns:
- `id` INT PK AUTO_INCREMENT
- `user_id` INT UNIQUE NOT NULL
- `fullname` VARCHAR(150) NOT NULL
- `phone_no` VARCHAR(20) NULL

Constraints:
- FK: `user_id -> users.id` ON DELETE CASCADE
- Unique: `user_id`

### `instructors`
Instructor profile tied 1:1 to a user.

Columns:
- `id` INT PK AUTO_INCREMENT
- `user_id` INT UNIQUE NOT NULL
- `fullname` VARCHAR(150) NOT NULL
- `phone_no` VARCHAR(20) NULL

Constraints:
- FK: `user_id -> users.id` ON DELETE CASCADE
- Unique: `user_id`

### `classes`
A class owned by an instructor profile.

Columns:
- `id` INT PK AUTO_INCREMENT
- `name` VARCHAR(100) NOT NULL
- `subject` VARCHAR(100) NULL
- `instructor_id` INT NOT NULL

Constraints:
- FK: `instructor_id -> instructors.id` ON DELETE CASCADE

### `class_students`
Join table for many-to-many between classes and students.

Columns:
- `id` INT PK AUTO_INCREMENT
- `class_id` INT NOT NULL
- `student_id` INT NOT NULL

Constraints:
- FK: `class_id -> classes.id` ON DELETE CASCADE
- FK: `student_id -> students.id` ON DELETE CASCADE
- Unique pair: `(class_id, student_id)`

### `sessions`
Scheduled session instances per class.

Columns:
- `id` INT PK AUTO_INCREMENT
- `class_id` INT NOT NULL
- `name` VARCHAR(150) NOT NULL
- `description` TEXT NULL
- `session_date` DATE NOT NULL
- `duration` INT NOT NULL
- `start_time` TIME NULL
- `end_time` TIME NULL

Constraints:
- FK: `class_id -> classes.id` ON DELETE CASCADE

Indexes:
- `idx_sessions_class_id` on `class_id`
- `idx_sessions_date` on `session_date`

### `attendance`
Attendance entry per `(session, student)`.

Columns:
- `id` INT PK AUTO_INCREMENT
- `session_id` INT NOT NULL
- `student_id` INT NOT NULL
- `status` ENUM('PRESENT', 'ABSENT', 'LATE') NOT NULL

Constraints:
- FK: `session_id -> sessions.id` ON DELETE CASCADE
- FK: `student_id -> students.id` ON DELETE CASCADE
- Unique pair: `(session_id, student_id)`

Indexes:
- `idx_attendance_session_id` on `session_id`
- `idx_attendance_student_id` on `student_id`

## Relationships

- `users (1) -> (0..1) students`
- `users (1) -> (0..1) instructors`
- `instructors (1) -> (N) classes`
- `classes (N) <-> (N) students` via `class_students`
- `classes (1) -> (N) sessions`
- `sessions (1) -> (N) attendance`
- `students (1) -> (N) attendance`

## Cascade Behavior

Deleting parent records cascades to dependents:
- Delete `users` -> deletes linked `students`/`instructors`
- Delete `instructors` -> deletes owned `classes`
- Delete `classes` -> deletes `class_students` and `sessions`
- Delete `sessions` -> deletes `attendance`
- Delete `students` -> deletes `class_students` and `attendance`
