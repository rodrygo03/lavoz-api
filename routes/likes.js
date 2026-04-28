import express from "express";
import { getLikes, getShortLikes, getReaction, addLike, addShortLike, deleteLike, deleteShortLike } from "../controllers/like.js";
import { validateToken } from "../jwt.js";

const router = express.Router()

router.get("/", getLikes);
router.get("/shorts", getShortLikes);
router.get("/single", getReaction);
router.post("/", validateToken(), addLike);
router.post("/shorts", validateToken(), addShortLike);
router.delete("/", validateToken(), deleteLike);
router.delete("/shorts", validateToken(), deleteShortLike);

export default router
