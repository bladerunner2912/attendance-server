import express from "express";
import users from "./users.js";
import classes from "./class.js";
import sessions from "./session.js";
import attendance from "./attendance.js";
const router = express.Router();

router.use("/auth/", users);
router.use("/classes", classes);
router.use("/sessions", sessions);
router.use("/attendance", attendance);

export default router;
