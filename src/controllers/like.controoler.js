import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Like } from "../models/like.models.js";
import { Tweet } from "../models/tweet.models.js";
import { Comment } from "../models/comment.models.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { VideoId } = req.params;

  if (!VideoId || !mongoose.Types.ObjectId.isValid(VideoId)) {
    throw new ApiError(400, "Video Id is required");
  }

  const isVideoLiked = await Like.findOne({
    likedBy: req.user?._id,
    video: VideoId,
  });

  if (isVideoLiked) {
    const RemoveVideoLike = await Like.findByIdAndDelete(isVideoLiked._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, RemoveVideoLike, "Like removed from video"));
  } else {
    const newLike = await Like.create({
      likedBy: req.user?._id,
      video: VideoId,
    });

    return res.status(200).json(new ApiResponse(200, newLike, "Video liked"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { TweetId } = req.params;

  if (!TweetId || !mongoose.Types.ObjectId.isValid(TweetId)) {
    throw new ApiError(400, "Tweet Id is required");
  }

  const isTweetLiked = await Like.findOne({
    likedBy: req.user?._id,
    tweet: TweetId,
  });

  if (isTweetLiked) {
    const RemoveTweetLike = await Like.findByIdAndDelete(isTweetLiked._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, RemoveTweetLike, "Like removed from tweet"));
  } else {
    const newLike = await Like.create({
      likedBy: req.user?._id,
      tweet: TweetId,
    });

    return res.status(200).json(new ApiResponse(200, newLike, "Tweet liked"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { CommentId } = req.params;

  if (!CommentId || !mongoose.Types.ObjectId.isValid(CommentId)) {
    throw new ApiError(400, "Comment Id is required");
  }

  const isCommentLiked = await Like.findOne({
    likedBy: req.user?._id,
    comment: CommentId,
  });

  if (isCommentLiked) {
    const RemoveCommentLike = await Like.findByIdAndDelete(
      isCommentLiked._id
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, RemoveCommentLike, "Like removed from comment"));
  } else {
    const newLike = await Like.create({
      likedBy: req.user?._id,
      comment: CommentId,
    });

    return res.status(200).json(new ApiResponse(200, newLike, "Comment liked"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const LikedVideo = await Like.aggregate([
    {
      $match: {
        likedBy: req.user._id,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$owner",
          },
          {
            $project: {
              videoFile: 1,
              thumbnail: 1,
              duration: 1,
              title: 1,
              views: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    {$unwind:"$video"}
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, LikedVideo, "liked videos fetched successfully")
    );
});

const getLikedTweets = asyncHandler(async (req, res) => {
  const LikedTweet = await Like.aggregate([
    {
      $match: {
        likedBy: req.user._id,
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "tweet",
        foreignField: "_id",
        as: "tweet",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$owner",
          },
          {
            $project: {
              content:1,
              owner:1
            },
          },
        ],
      },
    },
    {$unwind:"$tweet"}
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, LikedTweet, "liked tweets fetched successfully")
    );
});


export { toggleVideoLike, toggleTweetLike, toggleCommentLike, getLikedVideos,getLikedTweets };
