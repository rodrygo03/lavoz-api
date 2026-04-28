import express from "express";
import { getProjects, getProjectsByLocal, getProjectById, createProject, updateProject, deleteProject } from "../controllers/project.js";
import { validateToken } from "../jwt.js";

const router = express.Router();

router.get("/",         validateToken(),          getProjects);
router.get("/mine",     validateToken(["local"]), getProjectsByLocal);
router.get("/:id",      validateToken(),          getProjectById);
router.post("/",        validateToken(["local"]), createProject);
router.put("/:id",      validateToken(["local"]), updateProject);
router.delete("/:id",   validateToken(["local"]), deleteProject);

export default router;
