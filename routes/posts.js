import express from "express";
import { addJob, getLatestNews, getTopPosts, getJobs, deleteJob, deleteEvent, addShort, getShorts, deleteShort } from "../controllers/post.js";
import { getPosts, findPost, getEvents, addPost, addEvent, deletePost } from "../controllers/post.js"

const router = express.Router()

router.get("/", getPosts);
router.get("/find", findPost);
router.get("/top", getTopPosts);
router.get("/latestNews", getLatestNews);
router.get("/shorts", getShorts);
router.get("/events", getEvents);
router.get("/jobs", getJobs);
router.post("/addPost", addPost);
router.post("/event", addEvent);
router.post("/job", addJob);
router.post("/short", addShort);
router.delete("/:id", deletePost);
router.delete("/jobs/:id", deleteJob);
router.delete("/events/:id", deleteEvent);
router.delete("/shorts/:id", deleteShort);

export default router