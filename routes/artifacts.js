import express from "express";
import { getArtifactsByEscrow, deleteArtifact } from "../controllers/artifact.js";
import { validateToken } from "../jwt.js";

const router = express.Router();

router.get("/:escrowId",  validateToken(), getArtifactsByEscrow);
router.delete("/:id",     validateToken(), deleteArtifact);

export default router;
