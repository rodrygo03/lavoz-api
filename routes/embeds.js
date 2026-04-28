import express from "express";
import { getEmbeds, addEmbed, deleteEmbed } from "../controllers/embeds.js";
import { validateToken } from "../jwt.js";

const router = express.Router();

router.get("/", getEmbeds);
router.post("/", validateToken(), addEmbed);
router.delete("/", validateToken(), deleteEmbed);

export default router;
