import express from "express";
import { getStories, addStory, deleteStory } from "../controllers/story.js"
import { validateToken } from "../jwt.js";

const router = express.Router()

router.get("/", validateToken(), getStories);
router.post("/", validateToken(), addStory);
router.delete("/:id", validateToken(), deleteStory);

export default router
