import express from "express";
import { getRelationships, addRelationship, deleteRelationship, followUser, unfollowUser } from "../controllers/relationship.js";
import { validateToken } from "../jwt.js";

const router = express.Router()

router.get("/", getRelationships);
router.post("/", validateToken(), addRelationship);
router.post("/follow", validateToken(), followUser);
router.delete("/", validateToken(), deleteRelationship);
router.delete("/unfollow", validateToken(), unfollowUser);

export default router
