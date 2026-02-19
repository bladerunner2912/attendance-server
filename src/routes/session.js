import express from "express";
import sessionController from "../controllers/session.js";

const router = express.Router();

router.get("/:classId", sessionController.getSessionsByClassId);
router.post("/", sessionController.createSession);

export default router;
