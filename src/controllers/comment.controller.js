import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    
    const { content } = req.body
    const { videoId } = req.params
   

    const userId = req.user._id
    if(!videoId) {
        throw new ApiError(400, "video id not found or incorrect")
    }
    if(!content){
        throw new ApiError (400, "content must be required")
    }

    const addNewComment = await Comment.create({
        content,
        video:videoId,
        commentOwner:userId,
    })
    if(!addNewComment){
        throw new ApiError(400, "something went wrong while creating the comment")
    }
    return res 
    .status(201)
    .json(new ApiResponse(200, addNewComment , "Comment added  succesfully" ))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }