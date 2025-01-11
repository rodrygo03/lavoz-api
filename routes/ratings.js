import express from "express";
import { getRatings, addRating, deleteRating } from "../controllers/rating.js";

const router = express.Router()

router.get("/", getRatings);
router.post("/", addRating);
router.delete("/", deleteRating);

export default router