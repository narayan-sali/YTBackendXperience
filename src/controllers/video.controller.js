import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
     // Check if any field is empty
    const { title , description } = req.body
    console.log("title:", title)
    const userId = req.user._id
    if (
        [title && description].some((field)=>field?.trim()=== "")
        ){
        throw new ApiError(400 , "Title and description is required")
       }



     // checck for video and thumbnail
       const videoFileLocalPath = await req.files?.videoFile[0]?.path
       if(!videoFileLocalPath){
        throw new ApiError(400, "video file is required")
       }

       let thumbnailLocalPath;
   if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length>0) {
    thumbnailLocalPath = req.files.thumbnail[0].path
   }
   console.log(thumbnailLocalPath)
// upload on cloudinary
   const videoFile = await uploadOnCloudinary(videoFileLocalPath)
        if(!videoFile){
            throw new ApiError(400, "Video file is misssing")
        }
   const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        if(!thumbnail){
            throw new ApiError(400, "Thumnail is missing")
        }

    const  newVideo = await Video.create({
        title, 
        description, 
        videoFile:videoFile.url,
        thumbnail:thumbnail.url,
        duration: (videoFile?.duration / 60).toFixed(2),
        owner: userId
    })

    // check for video creation 
    const publishNewVideo = await Video.findById(newVideo._id)
    if(!publishNewVideo){
        throw new ApiError(500, "Something went wrong while publishing video")
    }


// return response
return  res.status(201).json(
    new ApiResponse (200, publishNewVideo , "Video Uploaded Successfully ")
  )
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId){
        throw new ApiError(400, "id not found")
    }
    const video = await Video.findById(videoId).populate('owner',  'fullName email avatar')
    if(!video) {
        throw new ApiError(500, "something went wrong while getting video")
    }
    return res 
    .status(200)
    .json(new ApiResponse(200, {video} , "video fetched succesffuly"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}