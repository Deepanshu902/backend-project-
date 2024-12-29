import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js";
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const {channelId} = req.params

  if(!isValidObjectId(channelId)){
    throw new ApiError(401,"Not valid channel id")
     }

     const channel = await User.findById(channelId)

     if(!channel){
        throw new ApiError(500,"Not able to get channel")
     }

     const subscribersCount = await Subscription.countDocuments({
        channel: channelId,
      });
      const channelsSubscribedToCount = await Subscription.countDocuments({
        subscriber: channelId,
      });
    
      // video fetch (not able to understand it use chatgpt )
      const videos = await Video.aggregate([
        {
          $match: {
            owner: channelId ? new mongoose.Types.ObjectId(channelId) : null,
          },
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "video",
            as: "likes",
          },
        },
        {
          $group: {
            _id: null,
            totalVideos: { $sum: 1 },
            totalViews: { $sum: "$views" },
            totalLikes: { $sum: { $size: "$likes" } },
          },
        },
        {
          $project: {
            _id: 0,
            totalVideos: 1,
            totalViews: 1,
            totalLikes: 1,
          },
        },
      ]);


      const channelStats = {
        subscribersCount: subscribersCount || 0,
        channelsSubscribedToCount: channelsSubscribedToCount || 0,
        totalVideos: videos[0]?.totalVideos || 0,
        totalViews: videos[0]?.totalViews || 0,
        totalLikes: videos[0]?.totalLikes || 0,
      };

      return res.status(200).json(new ApiResponse(200,channelStats,"Successfully retrived channel stats"))

})


const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

     const {channelId} =req.params

     if(!isValidObjectId(channelId)){
        throw new ApiError(401,"Not valid channel")
     }

     const user = await User.findById(channelId)

     if(!user){
        throw new ApiError(500,"Not able to get channel")
     }

     // fetch video is using mongodb aggregate dont understand it now so dont know how to do it
})

export {
    getChannelStats, 
    getChannelVideos
    }