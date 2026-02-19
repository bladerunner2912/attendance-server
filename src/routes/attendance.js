import express from "express";
import attendanceController from "../controllers/attendance.js";

const router = express.Router();

router.post("/bulk", attendanceController.addBulkAttendance);
router.get("/session/:sessionId", attendanceController.getAttendanceBySessionId);

export default router;
