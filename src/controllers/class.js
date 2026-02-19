import classes from "../models/class.js";

function parseId(value) {
    const id = Number.parseInt(value, 10);
    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }
    return id;
}

async function getClassesByInstructorId(req, res) {
    try {
        const instructorId = parseId(req.params.instructorId);
        if (!instructorId) {
            return res.status(400).json({ message: "Invalid instructorId" });
        }

        const data = await classes.getClassesByInstructorId(instructorId);
        return res.status(200).json({ classes: data ?? [] });
    } catch (error) {
        console.error("getClassesByInstructorId Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getClassesByStudentId(req, res) {
    try {
        const studentId = parseId(req.params.studentId);
        if (!studentId) {
            return res.status(400).json({ message: "Invalid studentId" });
        }

        const data = await classes.getClassesByStudentId(studentId);
        return res.status(200).json({ classes: data ?? [] });
    } catch (error) {
        console.error("getClassesByStudentId Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getClassesByUserId(req, res) {
    try {
        const userId = parseId(req.params.userId);
        if (!userId) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        const data = await classes.getClassesByUserId(userId);
        return res.status(200).json({ classes: data ?? [] });
    } catch (error) {
        console.error("getClassesByUserId Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getStudentsByClassId(req, res) {
    try {
        const classId = parseId(req.params.classId);
        if (!classId) {
            return res.status(400).json({ message: "Invalid classId" });
        }

        const data = await classes.getStudentsByClassId(classId);
        return res.status(200).json({ students: data ?? [] });
    } catch (error) {
        console.error("getStudentsByClassId Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getClassAttendanceSummary(req, res) {
    try {
        const classId = parseId(req.params.classId);
        if (!classId) {
            return res.status(400).json({ message: "Invalid classId" });
        }

        const data = await classes.getClassAttendanceSummary(classId);
        return res.status(200).json({
            class_id: classId,
            students: data ?? []
        });
    } catch (error) {
        console.error("getClassAttendanceSummary Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export default {
    getClassesByInstructorId,
    getClassesByStudentId,
    getClassesByUserId,
    getStudentsByClassId,
    getClassAttendanceSummary
};
