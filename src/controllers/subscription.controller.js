import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const userId = req.user._id
    if(!channelId){
        throw new ApiError(400, "channel id not found")
    }
    
    const channel = await User.findById({
        _id: channelId
    })
    if(!channel){
        throw new ApiError(400, "This channel does not Exists")
    }
    let subscribe;
    let unsubscribe;
    const itHasSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })
    if(itHasSubscription){
        unsubscribe = await Subscription.deleteOne({
            subscriber: req.user._id,
            channel: channelId
        })
        if(!unsubscribe){
            throw new ApiError(500, "something went wrong while unsubscribe the channel")
        }
    }else{
        subscribe = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })
        if(!subscribe){
            throw new ApiError(500, "something went wrong while subscribe the channel")
        }
    }
  return res
  .status(200)
  .json(new ApiResponse(200, `User ${subscribe? "subscribe": "unsubscribe"} channel  successfully !!`))

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
