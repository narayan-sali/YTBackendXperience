

import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content}= req.body
    const userId = req.user._id
    if(!content){
        throw new ApiError(400, "content not found")
    }
    const tweet = await Tweet.create({
        tweetOwner:req.user._id,
        content:content
    })
    if(!tweet){
        throw new ApiError(400, "can't create tweet")
    }
    return res
    .status(201)
    .json(new ApiResponse(200, tweet, "Tweet created succesfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
   const  {userId} = req.params
   
   if(!userId){
    throw new ApiError(400, "tweet id not found")
   }
   const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const tweets = await Tweet.aggregate([
        {
            $match:{
                tweetOwner: user._id,
            }
            
        }
    ]);

   if (!tweets){
    throw new ApiError("400", " user tweets not found")
   }
   return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetched successfully"))
})


const updateTweet = asyncHandler(async (req, res) => {
    const {content}= req.body
    const {tweetId} = req.params
    if(!content){
        throw new ApiError(400, "content not found")
    }
    if(!tweetId){
        throw new ApiError(400, "tweet Id not found")
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(400, "tweet not found or invalid tweet Id")
    }
    
    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId,{
        $set:{
            content:content,
            tweetOwner:req.user._id
        },
        
    },
    {
        new:true
    })
    return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "User tweets updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(400, "tweet Id not found")
    }
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
    if(!deletedTweet){
        throw new ApiError(400, "unable to delete ")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {},  "User tweets deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
