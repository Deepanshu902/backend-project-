import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)){
        throw new ApiError(401,"Not valid id")
    }

    const like = await Like.create({
        video: videoId,
        likeBy: req.user?._id
    })

    if(!like){
        throw new ApiError(500,"Error while creating like")
    }

    return res.status(200).json(new ApiResponse(200,{},"Video Liked "))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    if(!isValidObjectId(commentId)){
        throw new ApiError(401,"Not valid id")
    }

    const like = await Like.create({
        comment: commentId,
        likeBy: req.user?._id
    })

    if(!like){
        throw new ApiError(500,"Error while creating like")
    }

    return res.status(200).json(new ApiResponse(200,{},"comment Liked "))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    if(!isValidObjectId(tweetId)){
        throw new ApiError(401,"Not valid id")
    }

    const like = await Like.create({
        tweet: videoId,
        likeBy: req.user?._id
    })

    if(!like){
        throw new ApiError(500,"Error while creating like")
    }

    return res.status(200).json(new ApiResponse(200,{},"Tweet Liked "))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    // not able to understand mongodb pipeline for now
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}