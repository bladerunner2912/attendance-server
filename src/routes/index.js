import express from "express";
const router = express.Router();

import controller from "../controllers/index.js";


router.get("/ping", (req, res) => {
    return controller.pong(req, res);
});


export default router;
