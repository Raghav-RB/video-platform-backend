import { Router } from "express";
import {upload} from "../middlewares/multure.middleware.js"
import { LoginUser, LogoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),registerUser
)

router.route("/login").post(LoginUser)

router.route("/logout").post(verifyJWT,LogoutUser)

export default router