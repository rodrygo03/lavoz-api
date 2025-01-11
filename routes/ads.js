import express from "express";
import { getApprovedAds, getPendingAds, postAd, approveAd } from "../controllers/ad.js";

const router = express.Router()

router.get("/ads", getApprovedAds);
router.get("/pending", getPendingAds);
router.put("/", approveAd);
router.post("/", postAd);

export default router