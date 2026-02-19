import db from "../utils/db/index.js";

async function getClassesByInstructorId(instructorId) {
    const sql = `
        SELECT
            c.id,
            c.name,
            c.subject,
            c.instructor_id,
            i.user_id AS instructor_user_id,
            i.fullname AS instructor_name
        FROM classes c
        INNER JOIN instructors i ON i.id = c.instructor_id
        WHERE c.instructor_id = ?
        ORDER BY c.id DESC
    `;

    return db.query(sql, [instructorId]);
}

async function getClassesByStudentId(studentId) {
    const sql = `
        SELECT
            c.id,
            c.name,
            c.subject,
            c.instructor_id,
            i.user_id AS instructor_user_id,
            i.fullname AS instructor_name
        FROM class_students cs
        INNER JOIN classes c ON c.id = cs.class_id
        INNER JOIN instructors i ON i.id = c.instructor_id
        WHERE cs.student_id = ?
        ORDER BY c.id DESC
    `;

    return db.query(sql, [studentId]);
}

async function getClassesByUserId(userId) {
    const sql = `
        SELECT DISTINCT
            c.id,
            c.name,
            c.subject,
            c.instructor_id,
            i.user_id AS instructor_user_id,
            i.fullname AS instructor_name
        FROM classes c
        INNER JOIN instructors i ON i.id = c.instructor_id
        LEFT JOIN class_students cs ON cs.class_id = c.id
        LEFT JOIN students s ON s.id = cs.student_id
        WHERE i.user_id = ? OR s.user_id = ?
        ORDER BY c.id DESC
    `;

    return db.query(sql, [userId, userId]);
}

async function getStudentsByClassId(classId) {
    const sql = `
        SELECT
            s.id,
            s.user_id,
            s.fullname,
            s.phone_no,
            u.email
        FROM class_students cs
        INNER JOIN students s ON s.id = cs.student_id
        INNER JOIN users u ON u.id = s.user_id
        WHERE cs.class_id = ?
        ORDER BY s.id ASC
    `;

    return db.query(sql, [classId]);
}

async function getClassAttendanceSummary(classId) {
    const sql = `
        SELECT
            s.id AS student_id,
            s.fullname,
            u.email,
            s.phone_no,
            COALESCE(SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END), 0) AS attended_sessions,
            totals.total_sessions,
            CASE
                WHEN totals.total_sessions = 0 THEN 0
                ELSE ROUND(
                    (COALESCE(SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END), 0) * 100.0) / totals.total_sessions,
                    2
                )
            END AS present_attendance_percentage
        FROM class_students cs
        INNER JOIN students s ON s.id = cs.student_id
        INNER JOIN users u ON u.id = s.user_id
        CROSS JOIN (
            SELECT COUNT(*) AS total_sessions
            FROM sessions
            WHERE class_id = ?
        ) totals
        LEFT JOIN sessions se
            ON se.class_id = cs.class_id
        LEFT JOIN attendance a
            ON a.session_id = se.id
           AND a.student_id = s.id
        WHERE cs.class_id = ?
        GROUP BY
            s.id,
            s.fullname,
            u.email,
            s.phone_no,
            totals.total_sessions
        ORDER BY s.id ASC
    `;

    return db.query(sql, [classId, classId]);
}

export default {
    getClassesByInstructorId,
    getClassesByStudentId,
    getClassesByUserId,
    getStudentsByClassId,
    getClassAttendanceSummary
};
