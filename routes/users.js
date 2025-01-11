import express from "express";
import { getUser, getAllUsers, updateUser, getFollowers, getFollowing } from "../controllers/user.js";

const router = express.Router()

router.get("/find/:userId", getUser);
router.get("/", getAllUsers);
router.get("/followers", getFollowers);
router.get("/following", getFollowing);
router.put("/", updateUser);

export default router