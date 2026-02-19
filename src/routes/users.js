import express from "express";
import AuthController from "../controllers/users.js"
const router = express.Router();
import zod from '../validators/users.js';
import validate from '../utils/validate.js';

router.post('/register', validate(zod.registerSchema), AuthController.register);
router.post('/login', validate(zod.loginSchema), AuthController.login);



export default router;
