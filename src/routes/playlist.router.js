import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addvideoplaylist,
  createPlaylist,
  deleteplaylist,
  getPlaylistbyId,
  getUserPlaylist,
  removeVideoFromPlaylist,
  updateplaylit,
} from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createPlaylist);

router
  .route("/:playlistId")
  .get(getPlaylistbyId)
  .patch(updateplaylit)
  .delete(deleteplaylist);

router.route("/add/:videoId/:playlistId").patch(addvideoplaylist);

router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);

router.route("/user/:userId").get(getUserPlaylist);

export default router;
