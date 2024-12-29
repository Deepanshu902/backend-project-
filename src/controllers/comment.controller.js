import { isValidObjectId } from "mongoose"
import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!isValidObjectId(videoId)){
        throw new ApiError(401,"Not valid video id ")
    }

    const videoComments = await Comment.find({video: videoId})  // not findbyId as it only for id search purpose find return array
   
    if(videoComments.length ===0){
        throw new ApiError(500,"Failed to get video comments ")
    }   

    return res.status(200).json(new ApiResponse(200,videoComments,"Comments retrived Successfully "))


})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body

    if(!isValidObjectId(videoId)){
        throw new ApiError(401,"Not valid comment id")
    }
    if(!content){
        throw new ApiError(401,"Enter content ")
    }


    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(400, "The video was not found");
    }
  
    const commentCreated = await Comment.create({
      content: content,
      owner: req.user._id,
      video: video._id,
    });

    const comment = await Comment.findById(commentCreated._id);

  if (!comment) {
    throw new ApiError(500, "Failed to add a comment, please try again");
  }

  return res.status(200).json(new ApiResponse(200,comment,"Comment added successfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body

    if(!isValidObjectId(commentId)){
        throw new ApiError(401,"Not valid comment id")
    }
    if(!content){
        throw new ApiError(401,"Enter content ")
    }
    const updatedComment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            owner : req.user?._id
        }
    )
    if(!updatedComment){
        throw new ApiError(401,"You are not owner of comment")
    }

    return res.status(200).json(new ApiResponse(200,updateComment,"Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(401,"Not valid commentId")
    }

    const deletedComment = await Comment.findOneAndDelete(
        {
            _id: commentId,
            owner: req.user?._id
        }
    )
    if(!deletedComment){
        throw new ApiError(401,"Not valid comment or you are not owner of comment ")
    }

    return res.status(200).json(new ApiResponse(200,{},"Comment deleted Successfully"))

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }