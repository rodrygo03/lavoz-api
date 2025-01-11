import express from "express";
import { getComments, addComment, getCommentDesc } from "../controllers/comment.js";

const router = express.Router();

router.get("/", getComments);
router.get("/desc", getCommentDesc);
router.post("/", addComment);

export default router;