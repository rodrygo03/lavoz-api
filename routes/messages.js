import express from "express";
import { getMessages, addMessage, getAllMessages, getNewMessages, markAsRead } from "../controllers/message.js";

const router = express.Router()

router.get("/", getMessages);
router.get("/new", getNewMessages);
router.get("/all", getAllMessages);
router.post("/", addMessage);
router.put("/markRead", markAsRead);

export default router