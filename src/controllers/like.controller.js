import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User }  from "../models/user.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user._id
   console.log("videoId:", videoId)
    if(!(videoId)){
        throw new ApiError(400, "This video id is not valid")
    }

    const videoLike = await Like.findOne({
        video: videoId,
        likedBy: userId

    });
    console.log("videolike:", videoLike )
    let like;
    let unlike;

    if(videoLike){
        unlike = await Like.deleteOne({
            video: videoId,
            likedBy: req.user._id

        })

        if(!unlike){
            throw new ApiError(
                500,
                "something went wrong while like video !!"
            )
        }
    }else{
        like = await Like.create({
            video: videoId,
            likedBy: req.user._id
        })

        if(!like){
            throw new ApiError(
                500,
                "something went wrong while unlike video !!"
            )
        }
    }

    return res.status(201).json(
        new ApiResponse(200, {}, `User ${like? "like": "Unlike"} video successfully !!`)
    );
})
    

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId = req.user._id
    if(!commentId){
        throw new ApiError(400, "comment id not found")
    }
    const commentLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id

    })
    
    let like;
    let unlike;
    if(commentLike){
        unlike = await Like.deleteOne({
            comment:commentId,
            likedBy:req.user._id
        })
        if(!unlike){
            throw new ApiError(500, "something went wrong while unlike comment!!")
        }
    }else {
        like = await Like.create({
            comment:commentId,
            likedBy:req.user._id
        })
        if(!like){
            throw new ApiError(500, "something went wrong while like comment !!")
        }
    } 
    return res
    .status(200)
    .json( new ApiResponse(200, {}, `User ${like? "like": "Unlike"} comment successfully !!`))
    

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(400, "tweet id not found")
    }
    const tweetLike = await Like.findOne({
        tweet: tweetId,
        likedBy:req.user._id

    })

    let like;
    let unlike;
    if(tweetLike){
        unlike = await Like.deleteOne({
            tweet: tweetId,
            likedBy:req.user._id
        })
        if(!unlike){
            throw new ApiError(500, "something went wrong while unlike tweet!!")
        }
    }else{
        like = await Like.create({
            tweet:tweetId,
            likedBy:req.user._id
        })
        if(!like){
            throw new ApiError(500, "something went wrong while like tweet!!")
        }
    }
    return res
    .status(200)
    .json( new ApiResponse(200, {}, `User ${like? "like": "Unlike"} tweet successfully !!`))
    
    
})

const getLikedVideos = asyncHandler(async (req, res) => {
    
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}