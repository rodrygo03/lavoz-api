import express from "express";
import { getEmbeds, addEmbed, deleteEmbed } from "../controllers/embeds.js";

const router = express.Router();

router.get("/", getEmbeds);
router.post("/", addEmbed);
router.delete("/", deleteEmbed);

export default router;