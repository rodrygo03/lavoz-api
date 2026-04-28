import express from "express";
import { getApprovedAds, getPendingAds, postAd, approveAd } from "../controllers/ad.js";
import { validateToken } from "../jwt.js";

const router = express.Router()

router.get("/ads", validateToken(), getApprovedAds);
router.get("/pending", validateToken(), getPendingAds);
router.put("/", validateToken(), approveAd);
router.post("/", validateToken(), postAd);

export default router
