import express from "express";
import { getServices, createService, deleteService } from "../controllers/service.js";
import { validateToken } from "../jwt.js";

const router = express.Router();

router.get("/",       validateToken(),             getServices);
router.post("/",      validateToken(["student"]),  createService);
router.delete("/:id", validateToken(),             deleteService);

export default router;
