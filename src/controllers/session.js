import sessions from "../models/session.js";

function parseId(value) {
    const id = Number.parseInt(value, 10);
    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }
    return id;
}

async function getSessionsByClassId(req, res) {
    try {
        const classId = parseId(req.params.classId);
        if (!classId) {
            return res.status(400).json({ message: "Invalid classId" });
        }

        const data = await sessions.getSessionsByClassId(classId);
        return res.status(200).json({ sessions: data ?? [] });
    } catch (error) {
        console.error("getSessionsByClassId Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

function isValidIsoDate(dateString) {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

function isValidTime(timeString) {
    return /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(timeString);
}

function toSqlTime(totalSeconds) {
    const secondsInDay = 24 * 60 * 60;
    const normalized = ((totalSeconds % secondsInDay) + secondsInDay) % secondsInDay;
    const hours = String(Math.floor(normalized / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((normalized % 3600) / 60)).padStart(2, "0");
    const seconds = String(normalized % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function calculateEndTime(startTime, durationMinutes) {
    const [hourPart, minutePart, secondPart = "00"] = startTime.split(":");
    const startSeconds =
        Number.parseInt(hourPart, 10) * 3600 +
        Number.parseInt(minutePart, 10) * 60 +
        Number.parseInt(secondPart, 10);
    const endSeconds = startSeconds + durationMinutes * 60;
    return toSqlTime(endSeconds);
}

async function createSession(req, res) {
    try {
        const { class_id, name, description, session_date, duration, start_time } = req.body;

        const classId = parseId(class_id);
        if (!classId) {
            return res.status(400).json({ message: "Invalid class_id" });
        }
        const classData = await sessions.getClassById(classId);
        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ message: "Invalid name" });
        }

        if (description !== undefined && description !== null && typeof description !== "string") {
            return res.status(400).json({ message: "Invalid description" });
        }

        if (typeof session_date !== "string" || !isValidIsoDate(session_date)) {
            return res.status(400).json({ message: "Invalid session_date. Expected YYYY-MM-DD" });
        }

        const durationValue = Number.parseInt(duration, 10);
        if (!Number.isInteger(durationValue) || durationValue <= 0) {
            return res.status(400).json({ message: "Invalid duration" });
        }

        let startTime = null;
        let endTime = null;
        if (start_time !== undefined && start_time !== null && start_time !== "") {
            if (typeof start_time !== "string" || !isValidTime(start_time.trim())) {
                return res.status(400).json({ message: "Invalid start_time. Expected HH:MM or HH:MM:SS" });
            }
            startTime = start_time.trim();
            endTime = calculateEndTime(startTime, durationValue);
        }

        const sessionId = await sessions.createSession({
            class_id: classId,
            name: name.trim(),
            description: description?.trim() || null,
            session_date,
            duration: durationValue,
            start_time: startTime,
            end_time: endTime
        });

        return res.status(201).json({
            message: "Session created successfully",
            session_id: sessionId
        });
    } catch (error) {
        console.error("createSession Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export default {
    getSessionsByClassId,
    createSession
};
