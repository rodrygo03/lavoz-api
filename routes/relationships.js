import express from "express";
import { getRelationships, addRelationship, deleteRelationship, followUser, unfollowUser } from "../controllers/relationship.js";

const router = express.Router()

router.get("/", getRelationships);
router.post("/", addRelationship);
router.post("/follow", followUser);
router.delete("/", deleteRelationship);
router.delete("/unfollow", unfollowUser);

export default router