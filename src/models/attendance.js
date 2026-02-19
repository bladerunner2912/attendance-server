import db from "../utils/db/index.js";

async function getSessionById(sessionId) {
    const sql = `
        SELECT
            id,
            class_id,
            name,
            description,
            session_date,
            duration,
            start_time,
            end_time
        FROM sessions
        WHERE id = ?
        LIMIT 1
    `;

    const rows = await db.query(sql, [sessionId]);
    return rows?.[0] ?? null;
}

async function getClassStudentIds(classId) {
    const sql = `
        SELECT student_id
        FROM class_students
        WHERE class_id = ?
    `;

    return db.query(sql, [classId]);
}

async function upsertBulkAttendance(entries) {
    const placeholders = entries.map(() => "(?, ?, ?)").join(", ");
    const values = entries.flatMap((entry) => [entry.session_id, entry.student_id, entry.status]);

    const sql = `
        INSERT INTO attendance (session_id, student_id, status)
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE status = VALUES(status)
    `;

    return db.query(sql, values);
}

async function getSessionAttendanceWithStudents(sessionId) {
    const sql = `
        SELECT
            a.student_id,
            a.status,
            s.fullname,
            s.phone_no,
            u.email
        FROM attendance a
        INNER JOIN students s ON s.id = a.student_id
        INNER JOIN users u ON u.id = s.user_id
        WHERE a.session_id = ?
        ORDER BY s.fullname ASC, a.student_id ASC
    `;

    return db.query(sql, [sessionId]);
}

export default {
    getSessionById,
    getClassStudentIds,
    upsertBulkAttendance,
    getSessionAttendanceWithStudents
};
