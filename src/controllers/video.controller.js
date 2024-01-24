import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary , destroyOnCloudinary,destroyVideoFileOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    
    
})

const publishAVideo = asyncHandler(async (req, res) => {
     // Check if any field is empty
    const { title , description } = req.body
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
        // console.log(thumbnailLocalPath)
// upload on cloudinary
   const videoFile = await uploadOnCloudinary(videoFileLocalPath)
        if(!videoFile){
            throw new ApiError(400, "Video file is misssing")
        }
   const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        if(!thumbnail){
            throw new ApiError(400, "Thumnail is missing")
        }
        // console.log("thumbanil:", thumbnail)
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

//TODO: update video details like title, description, thumbnail
    const {videoId} = req.params
    
    if (!videoId) {
        throw new ApiError (400, "Video id  not found or invalid")
    } 
    //* check weather user  owner of this video or not
     const video = await Video.findByIdAndUpdate(videoId)
  
    if(!video){
        throw new ApiError(400, "something went wrong while fetching video")
    }
    if (!req.user._id.equals(video.owner._id)) {
        throw new ApiError(400, "you are not the owner of this video");
    }

    const { title, description } = req.body;
    const thumbnail = req.file;
   
    if (!title && !description && !thumbnail) {
        throw new ApiError(400, "Please provide atleast one filed");
      }
      //upload new thumbnail
    
    let newThumbnail;
    if (thumbnail) {
      newThumbnail = await uploadOnCloudinary(thumbnail.path);
    }
    
    //Delete old thumbnail
    const thumbnailToDelete = video.thumbnail;
   
    thumbnailToDelete ? await destroyOnCloudinary(thumbnailToDelete) : null;
    
    const updatedVideo = await Video.findOneAndUpdate(
        { _id: videoId },
        {
          title,
          description,
          ...(newThumbnail && { thumbnail: newThumbnail.url })
        },
        { new: true }
      );
      
      
      return res
      .status(201)
      .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    console.log('videoId:', videoId);
    //TODO: delete video
    if (!videoId) {
        throw new ApiError (400, "Video id  not found or invalid")
    } 
    //* check weather user  owner of this video or not
     const video = await Video.findById(videoId)
  
    if(!video){
        throw new ApiError(400, "something went wrong while fetching video")
    }
    if (!req.user._id.equals(video.owner._id)) {
        throw new ApiError(400, "you are not the owner of this video");
    }
    // Extract videoFile and thumbnail from the video object
    const { videoFile, thumbnail } = video;
    console.log('Video file ', videoFile);
    console.log('Thumbnail:', thumbnail);
    // delete video file from cloudinary 
   const videoTodelete = await destroyVideoFileOnCloudinary(videoFile)
   
    //  delete thumbanil from cloudinary 
    const thumbanilToDelete =  await destroyOnCloudinary(thumbnail)
    
   // Delete video document from the database
    const result = await Video.findByIdAndDelete(videoId)
    if(!result){
        throw new ApiError(400, "can not delete video ")
    }

    return res
    .status(201)
    .json(new ApiResponse(200, result , "Video deleted succesfully")) 

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