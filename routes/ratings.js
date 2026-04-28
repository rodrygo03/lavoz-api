import express from "express";
import { getRatings, addRating, deleteRating } from "../controllers/rating.js";
import { validateToken } from "../jwt.js";

const router = express.Router()

router.get("/", getRatings);
router.post("/", validateToken(), addRating);
router.delete("/", validateToken(), deleteRating);

export default router
