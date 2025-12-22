import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware";

import { createTweet, deleteTweet, getTweetbyTweetId, getTweetbyUserId, updateTweet } from "../controllers/tweet.controller";

const router  = Router()

router.use(verifyJWT)

router.route("/").post(createTweet)

router.route("/:tweetId").get(getTweetbyTweetId).patch(updateTweet).delete(deleteTweet)

router.route("/:userId").get(getTweetbyUserId)

export default router