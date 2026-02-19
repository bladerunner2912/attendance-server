import express from "express";
import classController from "../controllers/class.js";

const router = express.Router();

router.get("/instructor/:instructorId", classController.getClassesByInstructorId);
router.get("/student/:studentId", classController.getClassesByStudentId);
router.get("/user/:userId", classController.getClassesByUserId);
router.get("/:classId/students", classController.getStudentsByClassId);
router.get("/:classId/attendance-summary", classController.getClassAttendanceSummary);

export default router;
