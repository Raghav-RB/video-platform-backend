import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResonse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";
import mongoose from "mongoose";
import { Subscription } from "../models/subscription.models.js";
import {User} from "../models/user.models.js"

const getChannelVideos = asyncHandler(async (req, res) => {
  const channelVideos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResonse(200, channelVideos, "All videos are fetched"));
});

const getChannelStats = asyncHandler(async (req, res) => {
  const SubscruberCount = await Subscription.find({
    channel: new mongoose.Types.ObjectId(req.user?._id),
  }).countDocuments();

  const VideoCount = await Video.find({
    owner: new mongoose.Types.ObjectId(req.user?._id),
  }).countDocuments();

  const ViewsCount = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id)
      },
    },
    {
      $group:{
        _id:null,
        count:{
          $sum:"$views"
        }
      }
    }
  ])

  const TotalViewsonCHannel = ViewsCount[0]?.count || 0

  const LikesCount = await Video.aggregate([
    {
      $match:{
        owner: new mongoose.Types.ObjectId(req.user?._id)
      }
    },
    {
      $lookup:{
        from:"likes",
        localField:"_id",
        foreignField:"video",
        as:"likesoneach",
        pipeline:[
          {$count:"count"}
        ]
      }
    },
    {
      $group:{
        _id:null,
        totalLikes:{
          $sum:"$likesoneach.count"
        }
      }
    }
  ])

  const TotalLikesonChannel = LikesCount[0]?.totalLikes || 0

  const channelInfo = await User.findById(req.user?._id).select("-password refreshToken")

  const CommentCount = await Video.aggregate([
    {
      $match:{
        owner:new mongoose.Types.ObjectId(req.user?._id)
      }
    },
    {
      $lookup:{
        from:"comments",
        localField:"_id",
        foreignField:"video",
        as:"commentoneach",
        pipeline:[
          {$count:"commentsonthisvideo"}
        ]
      }
    },
    {
      $group:{
        _id:null,
        totalcomment:{
          $sum:"$commentoneach.commentsonthisvideo"
        }
      }
    }
  ])

  const TotalCommentonChannel = CommentCount[0]?.totalcomment || 0

  return res
  .status(200)
  .json(
    new ApiResonse(200 , {
                            SubscruberCount,
                            VideoCount,
                            TotalViewsonCHannel,
                            TotalLikesonChannel,
                            TotalCommentonChannel,
                            channelInfo
                          },
                          "Channel Stats"
  )
  )
});

export { getChannelVideos, getChannelStats };
