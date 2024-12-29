import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    if(!content){
        throw new ApiError(401,"Write Tweet");
        
    }

  const tweet =   await Tweet.create(
        {
            content: content,
            owner : req.user?._id

        })

        if(!tweet){
            throw new ApiError(500,"Error while creating tweet")

        }

        return res.status(200).json(200,tweet,"Tweet created successfully")

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params
    
    if(!isValidObjectId(userId)){
        throw new ApiError(401,"Not valid userId")
    }

    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(401,"No user found")
    }

    const tweets = await Tweet.find({owner:userId})

    return res.status(200).json(
        200,
        tweets,
        "Successfully Fetched Tweets"
    )



})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {content} = req.body
    const {tweetId}  = req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(401,"Not valid userId")
    }
    if(!content){
        throw new ApiError(401,"Enter content")

    }
        const tweet = await Tweet.findAndUpdate(
            {
                _id:tweetId,
                owner: req.user?._id
            },
            {   
                $set:{
                content : content
            }
            },
            {
                new:true
            }
        )
        if(!tweet){
            throw new ApiError(401,"No tweet found ")
        }   

        return res
        .status(200)
        .json(new ApiResponse(201, tweet, "Successfully updated the tweet"));
    

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(401,"Not valid tweetId")
    }
    const deleteTweet = await Tweet.findOneAndDelete(
        {
            _id: tweetId,
            owner: req.user?._id,
        }
    )

    if(!deleteTweet){
        throw new ApiError(500,"No tweet or you are not owner of tweet")
    }

    return res.status(200).json(new ApiResponse(200,{},"Successfully deleted the tweet"))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}