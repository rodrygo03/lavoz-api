import express from "express";
import { getNotifications, getNewNotifications, getLikeNotif, getFollowNotif, getCommentNotif, clearNotifAlert } from "../controllers/notification.js";

const router = express.Router()

router.get("/all", getNotifications);
router.get("/new", getNewNotifications);
router.get("/like", getLikeNotif);
router.get("/follow", getFollowNotif);
router.get("/comment", getCommentNotif);
router.put("/clearAlert", clearNotifAlert);

export default router