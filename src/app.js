import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use(express.static("public"))

app.use(cookieParser())

import userRouter from "./routes/user.router.js"

app.use("/api/v1/users",userRouter)

// ======================================================================================

import videoRouter from "./routes/video.router.js"

app.use("/api/v1/video",videoRouter)

// ======================================================================================

import healthRouter from "./routes/healthcheck.router.js"

app.use("/api/v1/health-check",healthRouter)

// ======================================================================================

import tweetRouter from "./routes/tweet.route.js"

app.use("/api/v1/tweet",tweetRouter)

// ======================================================================================

import subsRouter from "./routes/subscription.route.js"

app.use("/api/vi/subscription",subsRouter)

// ======================================================================================

import dashboardRouter from "./routes/dashboard.router.js"

app.use("/api/v1/dashboard",dashboardRouter)

// ======================================================================================

import likeRouter from "./routes/like.router.js"

app.use("/api/v1/likes",likeRouter)

// ======================================================================================

import commentRouter from "./routes/comment.router.js"

app.use("/api/v1/comments",commentRouter)

// ======================================================================================

import playlistRouter from "./routes/playlist.router.js"

app.use("/api/v1/playlist",playlistRouter)

export {app}