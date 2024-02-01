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
    const { content } = req.body
    const {commentId} = req.params
    const userId = req.user._id
    
    if(!commentId) {
        throw new ApiError(400, "comment id not found or incorrect")
    }
    if(!content){
        throw new ApiError (400, "content must be required")
    }

    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(400, "commentID not found")
    }
    const updatedComment = await Comment.findByIdAndUpdate(commentId,
        {
            $set:{
              content : content
              
            }
          },
          {new: true})
      
    if(!updatedComment){
        throw new ApiError(500, "Error while updating errors")
    }
    return res 
    .status(200)
    .json(new ApiResponse (200, updateComment , "comment added succesffuly"))

})

const deleteComment = asyncHandler(async (req, res) => {
    const commentId = req.params
    const content = req.body
    if (!commentId){
        throw new ApiError (401, 'invalid comment id or comment id not found')
    }
    if(!content) {
        throw new ApiError(401, "content must be required ")
    }

    const comment = await Comment.findById(videoId);
    if (comment.commentOwner !== req.user) {
        throw new ApiError(403, "You are not allowed");
    }
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
        throw new ApiError(404, "Something went wrong while deleting comment!");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }