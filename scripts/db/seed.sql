USE __DB_NAME__;

-- Password hash generated via: node scripts/hashPassword.js daisy123
SET @default_password_hash = '$2b$10$tHeyEqusmiLCg.X3rRPnrO4X4C/fUnCG3Uu5rL5V9BMq8FOrLhmEq';

INSERT INTO users (email, password, role) VALUES
('instructor1@example.com', @default_password_hash, 'INSTRUCTOR'),
('instructor2@example.com', @default_password_hash, 'INSTRUCTOR');

INSERT INTO instructors (user_id, fullname, phone_no)
SELECT id,
       CASE email
           WHEN 'instructor1@example.com' THEN 'Arjun'
           WHEN 'instructor2@example.com' THEN 'Meera'
       END,
       CASE email
           WHEN 'instructor1@example.com' THEN '9000000001'
           WHEN 'instructor2@example.com' THEN '9000000002'
       END
FROM users
WHERE email IN ('instructor1@example.com', 'instructor2@example.com');

INSERT INTO users (email, password, role) VALUES
('student1@example.com', @default_password_hash, 'STUDENT'),
('student2@example.com', @default_password_hash, 'STUDENT'),
('student3@example.com', @default_password_hash, 'STUDENT'),
('student4@example.com', @default_password_hash, 'STUDENT'),
('student5@example.com', @default_password_hash, 'STUDENT'),
('student6@example.com', @default_password_hash, 'STUDENT'),
('student7@example.com', @default_password_hash, 'STUDENT'),
('student8@example.com', @default_password_hash, 'STUDENT'),
('student9@example.com', @default_password_hash, 'STUDENT'),
('student10@example.com', @default_password_hash, 'STUDENT'),
('student11@example.com', @default_password_hash, 'STUDENT'),
('student12@example.com', @default_password_hash, 'STUDENT'),
('student13@example.com', @default_password_hash, 'STUDENT'),
('student14@example.com', @default_password_hash, 'STUDENT'),
('student15@example.com', @default_password_hash, 'STUDENT'),
('student16@example.com', @default_password_hash, 'STUDENT'),
('student17@example.com', @default_password_hash, 'STUDENT'),
('student18@example.com', @default_password_hash, 'STUDENT'),
('student19@example.com', @default_password_hash, 'STUDENT'),
('student20@example.com', @default_password_hash, 'STUDENT');

INSERT INTO students (user_id, fullname, phone_no)
SELECT id,
       CASE email
           WHEN 'student1@example.com' THEN 'Aarav'
           WHEN 'student2@example.com' THEN 'Vihaan'
           WHEN 'student3@example.com' THEN 'Aditya'
           WHEN 'student4@example.com' THEN 'Krishna'
           WHEN 'student5@example.com' THEN 'Ishaan'
           WHEN 'student6@example.com' THEN 'Rohan'
           WHEN 'student7@example.com' THEN 'Karan'
           WHEN 'student8@example.com' THEN 'Kabir'
           WHEN 'student9@example.com' THEN 'Reyansh'
           WHEN 'student10@example.com' THEN 'Arnav'
           WHEN 'student11@example.com' THEN 'Anaya'
           WHEN 'student12@example.com' THEN 'Aditi'
           WHEN 'student13@example.com' THEN 'Diya'
           WHEN 'student14@example.com' THEN 'Ira'
           WHEN 'student15@example.com' THEN 'Myra'
           WHEN 'student16@example.com' THEN 'Saanvi'
           WHEN 'student17@example.com' THEN 'Riya'
           WHEN 'student18@example.com' THEN 'Kavya'
           WHEN 'student19@example.com' THEN 'Nisha'
           WHEN 'student20@example.com' THEN 'Pooja'
       END,
       CONCAT('8000000', LPAD(id, 3, '0'))
FROM users
WHERE role = 'STUDENT';

SET @instructor_1_id = (
    SELECT i.id
    FROM instructors i
    INNER JOIN users u ON u.id = i.user_id
    WHERE u.email = 'instructor1@example.com'
    LIMIT 1
);

SET @instructor_2_id = (
    SELECT i.id
    FROM instructors i
    INNER JOIN users u ON u.id = i.user_id
    WHERE u.email = 'instructor2@example.com'
    LIMIT 1
);

INSERT INTO classes (name, subject, instructor_id) VALUES
('Class 1 - Data Structures', 'Data Structures', @instructor_1_id),
('Class 2 - Database Systems', 'Database Systems', @instructor_1_id),
('Class 3 - Operating Systems', 'Operating Systems', @instructor_2_id),
('Class 4 - Computer Networks', 'Computer Networks', @instructor_2_id),
('Class 5 - Software Engineering', 'Software Engineering', @instructor_1_id);

INSERT INTO class_students (class_id, student_id)
SELECT c.id, s.id
FROM classes c
CROSS JOIN students s;

INSERT INTO sessions (class_id, name, description, session_date, duration, start_time, end_time)
SELECT
    c.id,
    CONCAT(c.name, ' - Session ', n.session_no),
    CONCAT('Planned lesson ', n.session_no, ' for ', c.subject),
    DATE_ADD('2026-01-06', INTERVAL ((c.id - 1) * 14 + n.session_no - 1) DAY),
    60,
    '10:00:00',
    '11:00:00'
FROM classes c
CROSS JOIN (
    SELECT 1 AS session_no UNION ALL
    SELECT 2 UNION ALL
    SELECT 3 UNION ALL
    SELECT 4 UNION ALL
    SELECT 5 UNION ALL
    SELECT 6 UNION ALL
    SELECT 7 UNION ALL
    SELECT 8 UNION ALL
    SELECT 9 UNION ALL
    SELECT 10
) n
ORDER BY c.id, n.session_no;

INSERT INTO attendance (session_id, student_id, status)
SELECT
    se.id,
    cs.student_id,
    CASE
        WHEN MOD(se.id + cs.student_id, 5) = 0 THEN 'LATE'
        WHEN MOD(se.id + cs.student_id, 2) = 0 THEN 'PRESENT'
        ELSE 'ABSENT'
    END
FROM sessions se
INNER JOIN class_students cs ON cs.class_id = se.class_id;
