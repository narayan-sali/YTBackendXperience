import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
   
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
   
    if(!videoId){
        throw new ApiError(400,"videoId is required!!");
    }
    const video = await Video.findById(videoId);
    if(!video){
         // If the video doesn't exist, delete all comments associated with the video ID
         await Comment.deleteMany({ video: videoId });
         throw new ApiError(400, "There is no such Video. All associated comments have been deleted.");
    }
    const commentsAggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes",
            },
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes",
                },
                owner: {
                    $first: "$owner",
                },
                isLiked: {
                    $cond: {
                        if: {$in: [req.user?._id, "$likes.likedBy"]},
                        then: true,
                        else: false
                    }
                }
            },
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                likesCount: 1,
                owner: {
                    username: 1,
                    fullName: 1,
                    "avatar.url": 1,
                },
                isLiked: 1
            },
        },
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };
    const comments = await Comment.aggregatePaginate(
        commentsAggregate,
        options
    );

    if(!comments || comments.length === 0){
        return res
        .status(200)
        .json(new ApiResponse(200,{},"No commments in this video!!"))
    }
    return res
    .status(200)
    .json(new ApiResponse(200,comments,"Comments of the video fetched Successfully"))


})

const addComment = asyncHandler(async (req, res) => {
   
    
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
    const {commentId} = req.params
    const  userId = req.user._id
    
    if (!commentId){
        throw new ApiError (401, 'invalid comment id or comment id not found')
    }
    
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    
    if (comment.commentOwner.toString() != req.user._id) {
        throw new ApiError(403, "You do not have permission to update this comment!");
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