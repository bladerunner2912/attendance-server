import attendanceModel from "../models/attendance.js";

const ALLOWED_STATUS = new Set(["PRESENT", "ABSENT", "LATE"]);

function parseId(value) {
    const id = Number.parseInt(value, 10);
    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }
    return id;
}

async function addBulkAttendance(req, res) {
    try {
        const { session_id, attendance } = req.body;
        const sessionId = parseId(session_id);

        if (!sessionId) {
            return res.status(400).json({ message: "Invalid session_id" });
        }

        if (!Array.isArray(attendance) || attendance.length === 0) {
            return res.status(400).json({ message: "attendance must be a non-empty array" });
        }

        const session = await attendanceModel.getSessionById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const classStudentRows = await attendanceModel.getClassStudentIds(session.class_id);
        const classStudentIds = new Set(classStudentRows.map((row) => row.student_id));

        const dedupedByStudent = new Map();
        for (const item of attendance) {
            const studentId = parseId(item?.student_id);
            const status = typeof item?.status === "string" ? item.status.toUpperCase() : "";

            if (!studentId) {
                return res.status(400).json({ message: "Invalid student_id in attendance array" });
            }

            if (!ALLOWED_STATUS.has(status)) {
                return res.status(400).json({ message: "Invalid status in attendance array" });
            }

            if (!classStudentIds.has(studentId)) {
                return res.status(400).json({
                    message: `Student ${studentId} is not part of session class`
                });
            }

            dedupedByStudent.set(studentId, {
                session_id: sessionId,
                student_id: studentId,
                status
            });
        }

        const entries = [...dedupedByStudent.values()];
        await attendanceModel.upsertBulkAttendance(entries);

        return res.status(201).json({
            message: "Attendance upserted successfully",
            session_id: sessionId,
            inserted_or_updated: entries.length
        });
    } catch (error) {
        console.error("addBulkAttendance Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getAttendanceBySessionId(req, res) {
    try {
        const sessionId = parseId(req.params.sessionId);
        if (!sessionId) {
            return res.status(400).json({ message: "Invalid sessionId" });
        }

        const session = await attendanceModel.getSessionById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const rows = await attendanceModel.getSessionAttendanceWithStudents(sessionId);

        const present = [];
        const absent = [];

        for (const row of rows) {
            if (row.status === "PRESENT") {
                present.push(row.fullname);
            } else if (row.status === "ABSENT") {
                absent.push(row.fullname);
            }
        }

        return res.status(200).json({
            session_id: sessionId,
            session,
            present,
            absent,
            present_count: present.length,
            absent_count: absent.length
        });
    } catch (error) {
        console.error("getAttendanceBySessionId Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export default {
    addBulkAttendance,
    getAttendanceBySessionId
};
