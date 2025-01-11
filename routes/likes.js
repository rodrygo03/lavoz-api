import express from "express";
import { getLikes, getShortLikes, getReaction, addLike, addShortLike, deleteLike, deleteShortLike } from "../controllers/like.js";

const router = express.Router()

router.get("/", getLikes);
router.get("/shorts", getShortLikes);
router.get("/single", getReaction);
router.post("/", addLike);
router.post("/shorts", addShortLike);
router.delete("/", deleteLike);
router.delete("/shorts", deleteShortLike);

export default router