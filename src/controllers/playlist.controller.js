import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    // Check if any field is empty
    const { name , description } = req.body
    const userId = req.user._id
    if (
        [name && description].some((field)=>field?.trim()=== "")
        ){
        throw new ApiError(400 , "Name and Description is  must required")
       }

    console.log("userID:" , userId)
    const  playlist = await Playlist.create({
        name: name,
        description:description,
        playlistOwner: req.user?._id,
        videos: []
    })
    if(!playlist){
        throw new ApiError(400, "Error while creating Playlist")
    }

    return res
    .status(201)
    .json(new ApiResponse(200, playlist, "playList created succesffuly"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if(!userId){
        throw new ApiError(400, "user id not found")
    }
   
    const playlists = await Playlist.find({playlistOwner:userId}).populate('playlistOwner',  'fullName email avatar')
  
   // if playlists are empty we can send  || playLists.length === 0
    if (!playlists ){
        throw new ApiError(400, "No playlists found for the specified user" )
    }
    return res
    .status(200)
    .json(new ApiResponse(200,{playlists}, "playList fetched succesfully" ))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
    const userId = req.user._id
    if(!playlistId){
        throw new ApiError(400, "playlist id not found")
    }
    const getOwnerPlaylist = await Playlist.findById(playlistId)
   if(!getOwnerPlaylist){
      throw new ApiError(400, "playlist not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,{getOwnerPlaylist}, "playList fetched succesfully" ))
})


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!playlistId){
        throw new ApiError(400, "playListId not found")
    }
    if(!videoId){
        throw new ApiError(400, "video id not found")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(400, "playlsit not found ")
    }
    //videos is an array in  Playlist model
    playlist.videos.push(videoId);
    // Saving the updated playlist
    const updatedPlaylist = await playlist.save();
    return res
    .status(200)
    .json(new ApiResponse(200,{updatedPlaylist}, "Video added to playlist successfully" ))
})


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!playlistId){
        throw new ApiError(400, "playListId not found")
    }
    if(!videoId){
        throw new ApiError(400, "video id not found")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(400, "playlsit not found ")
    }
    //videos is an array in  Playlist model
    playlist.videos.pull(videoId);
    // Saving the updated playlist
    const updatedPlaylist = await playlist.save();
    return res
    .status(200)
    .json(new ApiResponse(200,{updatedPlaylist}, "Video removed from playlist successfully" ))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if (!playlistId){
        throw new ApiError(400, "playlist id not found")
    }
    const playlist = await Playlist.findByIdAndDelete(playlistId)
    if(!playlist){
        throw new ApiError(400, "can not delete playlist ")
    }
    return res
    .status(201)
    .json(new ApiResponse(200, playlist,"Succesfully deleted video playlist "))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    const userId = req.user._id
    if (
        [name || description].some((field)=>field?.trim()=== "")
        ){
        throw new ApiError(400 , "Name or Description is  must required")
       }
    const playlist = await Playlist.findByIdAndUpdate(playlistId,{
        name : name,
        description: description,
        playListOwner: req.user?._id,
        videos: []
    })
    if(!playlist){
        throw new ApiError(400, "playlist not found")
    }
    return res
    .status(201)
    .json(new ApiResponse(200, playlist, "playlist updated successfully"));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
