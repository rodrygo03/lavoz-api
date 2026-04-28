import express from "express";
import { getComments, addComment, getCommentDesc } from "../controllers/comment.js";
import { validateToken } from "../jwt.js";

const router = express.Router();

router.get("/", getComments);
router.get("/desc", getCommentDesc);
router.post("/", validateToken(), addComment);

export default router;
