import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.models.js";
import mongoose from "mongoose";
import { Video } from "../models/video.models.js";

const getcommentsonVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Video Id is required");
  }

  const { page = 1, limit = 10 } = req.query;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const comments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
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
      $sort: { createdAt: -1 },
    },
    {
      $skip: (parseInt(page) - 1) * parseInt(limit),
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "comments fetched successfully"));
});

const addcomment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Video Id is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const { content } = req.body;
  if (!content || !content.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const comment = await Comment.create({
    content: content,
    video: videoId,
    owner: req.user?._id,
  });
  if (!comment) {
    throw new ApiError(500, "Something went wrong while creating comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment added succeefully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Comment Id is required");
  }

  const { newcontent } = req.body;
  if (!newcontent || !newcontent.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only owner can update the comment");
  }

  const updatecomment = await Comment.findByIdAndUpdate(
    commentId,
    { content: newcontent },
    { new: true }
  );
  if (!updatecomment) {
    throw new ApiError(500, "Something went wrong while updating the comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatecomment, "comment updated successfully"));
});

const deletecomment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Comment id is required");
  }

  const deletethis = await Comment.findOneAndDelete({
    _id: commentId,
    owner: req.user?._id,
  });
  if (!deletethis) {
    throw new ApiError(500, "Comment not found or you are not authorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "comment deleted successfully"));
});

export { getcommentsonVideo, addcomment, updateComment, deletecomment };
