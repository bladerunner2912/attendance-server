import express from "express";
import attendanceController from "../controllers/attendance.js";
import auth from "../middlewares/authenticate.js";
import validate from "../utils/validate.js";
import zod from "../validators/attendance.js";

const router = express.Router();

router.use(auth.authenticate);

router.post("/bulk", auth.authorize("INSTRUCTOR"), validate(zod.addBulkAttendanceSchema), attendanceController.addBulkAttendance);
router.get("/session/:sessionId", validate(zod.sessionIdParamSchema, "params"), attendanceController.getAttendanceBySessionId);

export default router;
