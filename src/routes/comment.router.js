import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { addcomment, deletecomment, getcommentsonVideo, updateComment } from "../controllers/comment.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/:videoId").get(getcommentsonVideo).post(addcomment)

router.route("/c/:commentId").patch(updateComment).delete(deletecomment)

export default router