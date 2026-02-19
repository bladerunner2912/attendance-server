import express from "express";
import sessionController from "../controllers/session.js";
import auth from "../middlewares/authenticate.js";
import validate from "../utils/validate.js";
import zod from "../validators/session.js";

const router = express.Router();

router.use(auth.authenticate);

router.get("/:classId", validate(zod.classIdParamSchema, "params"), sessionController.getSessionsByClassId);
router.post("/", auth.authorize("INSTRUCTOR"), validate(zod.createSessionSchema), sessionController.createSession);

export default router;
