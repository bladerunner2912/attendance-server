import db from "../utils/db/index.js";

async function getSessionsByClassId(classId) {
    const sql = `
        SELECT
            s.id,
            s.class_id,
            s.name,
            s.description,
            s.session_date,
            s.duration,
            s.start_time,
            s.end_time
        FROM sessions s
        WHERE s.class_id = ?
        ORDER BY s.session_date DESC, s.id DESC
    `;

    return db.query(sql, [classId]);
}

async function createSession({ class_id, name, description, session_date, duration, start_time = null, end_time = null }) {
    const sql = `
        INSERT INTO sessions (class_id, name, description, session_date, duration, start_time, end_time)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await db.query(sql, [class_id, name, description, session_date, duration, start_time, end_time]);
    return result?.insertId ?? null;
}

async function getClassById(classId) {
    const sql = `
        SELECT id
        FROM classes
        WHERE id = ?
        LIMIT 1
    `;

    const rows = await db.query(sql, [classId]);
    return rows?.[0] ?? null;
}

export default {
    getSessionsByClassId,
    createSession,
    getClassById
};
