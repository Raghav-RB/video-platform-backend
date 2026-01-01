import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { getLikedTweets, getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controoler.js";

const router = Router()

router.use(verifyJWT)

router.route("/toggle/v/:videoId").post(toggleVideoLike)

router.route("/toggle/v/:tweetId").post(toggleTweetLike)

router.route("/toggle/v/:commentId").post(toggleCommentLike)

router.route("/video").get(getLikedVideos)

router.route("/tweet").get(getLikedTweets)

export default router