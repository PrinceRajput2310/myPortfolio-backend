import express from "express";
import { sendMessage } from "../controllers/message.controllers.js";

const router = express.Router();

router.route("/send-message").post(sendMessage);

export default router;
