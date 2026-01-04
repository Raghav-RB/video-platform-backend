import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";
import { Playlist } from "../models/playlist.models.js";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required");
  }
  if (!description) {
    throw new ApiError(400, "Description is required");
  }

  const newPlaylist = await Playlist.create({
    name,
    description,
    owner: req.user?._id,
  });

  if (!newPlaylist) {
    throw new ApiError(500, "Something went wrong while creating new playlist");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newPlaylist, "Playlist created successfully"));
});

const getUserPlaylist = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "User Id is required");
  }

  const userplaylist = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
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
        ],
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        videos: 1,
        createdAt: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, userplaylist, "Playlist fetched successfully"));
});

const getPlaylistbyId = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Playlist Id is required");
  }

  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
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
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          { $unwind: "$owner" },
        ],
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        videos: 1,
        createdAt: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addvideoplaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Playlist Id is required");
  }

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Video Id is required");
  }

  const playlist = await Playlist.findById(playlistId);
  const video = await Video.findById(videoId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (playlist.videos.includes(videoId)) {
    throw new ApiError(404, "Videos is already existed in playlist");
  }

  playlist.videos.push(videoId);
  const update = await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, update, "Video added to playlist"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Playlist Id is required");
  }

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Video Id is required");
  }

  const playlist = await Playlist.findById(playlistId);
  const video = await Video.findById(videoId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const remove = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: videoId,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, remove, "Video removed from the playlist"));
});

const deleteplaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Playlist Id is required");
  }

  const deleted = await Playlist.findOneAndDelete({
    _id: playlistId,
    owner: req.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, deleted, "Playlist deleted successfully"));
});

const updateplaylit = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Playlist Id is required");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const { name, description } = req.body;

  if (!name && !description) {
    throw new ApiError(400, "Atleast one feild is required");
  }

  if (name) playlist.title = name;
  if (description) playlist.description = description;
  const update = await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, update, "Playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylist,
  getPlaylistbyId,
  addvideoplaylist,
  removeVideoFromPlaylist,
  deleteplaylist,
  updateplaylit
};
