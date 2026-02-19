import express from "express";
import classController from "../controllers/class.js";
import auth from "../middlewares/authenticate.js";
import validate from "../utils/validate.js";
import zod from "../validators/class.js";

const router = express.Router();

router.use(auth.authenticate);

router.get("/instructor/:instructorId", validate(zod.instructorIdParamSchema, "params"), classController.getClassesByInstructorId);
router.get("/student/:studentId", validate(zod.studentIdParamSchema, "params"), classController.getClassesByStudentId);
router.get("/user/:userId", validate(zod.userIdParamSchema, "params"), classController.getClassesByUserId);
router.get("/:classId/students", validate(zod.classIdParamSchema, "params"), classController.getStudentsByClassId);
router.get("/:classId/attendance-summary", validate(zod.classIdParamSchema, "params"), classController.getClassAttendanceSummary);

export default router;
