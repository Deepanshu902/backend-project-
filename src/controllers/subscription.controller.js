import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Subscription} from "../models/subscription.model.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    if (!isValidObjectId(channelId)) {
      throw new ApiError(400, "Invalid ChannelId");
    }
    if (req.user?._id === new mongoose.Types.ObjectId(channelId)) {
      throw new ApiError(400, "you can not subscribe yourself");
    }
    const unsubscribe = await Subscription.findOneAndDelete({
      channel: channelId,
      subscriber: req.user._id,
    });
  
    if (!unsubscribe) {
      const subscribe = await Subscription.create({
        channel: channelId,
        subscriber: req.user._id,
      });
      if (!subscribe) {
        throw new ApiError(500, "Error while subscribing");
      }
    }
    return res
      .status(200)
      .json(new ApiRes(201, "Successfully toggled subscription"));
  });


  export {
    toggleSubscription
  }