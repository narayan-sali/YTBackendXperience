import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from "../models/user.model.js"
import {uploadClodinary} from "../utils/cloudinary.js"
import { ApiRsponse } from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req,res) => {
   const  {fullName , email , username ,  password} = req.body
   console.log("email:", email);
   if (
    [fullName , email , password , username ].some((field)=>
    field?.trim() === "")
    ) {
    throw new ApiError(400 , "All fields are required")
   }

   const existedUser = await User.findOne  ({
    $or: [{ username } , { email }]
   });

   if (existedUser){
    throw new ApiError (409 , "User with email or username already exists")
   }


   // checck for images , avatar 
   const avatarLocalPath = await req.files?.avatar[0]?.path
   const coverImageLocalPath = await req.files?.coverImage[0]?.path

   if (!avatarLocalPath){
    throw new ApiError(400 , "Avatar file is required ")
   }
//    const { fullName , email , username, password} = req.body
//    console.log("email", email)
    
});
        // upload avatar,coverimage to cloudinary
       const avatar = await uploadClodinary(avatarLocalPath)
       console.log(avatar)
       const coverImage = await uploadClodinary(coverImageLocalPath)
       console.log(coverImage)
       if (!avatar){
        throw new ApiError (400 , "Avatar file is required ")
       }

       //create user object  - create entry in db 
       
      const user =  await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
      })

      // remove password and refresh field from response 
     const  createdUser =   await User.findById(user._id).select(
      "-password -refreshToken"
     )
     // check user creation 
     if(!createdUser){
      throw new ApiError (500, "Something went wrong while registering the user")
     }

      await User.findById(user._id)
  // return response
      return res.status(201).json(
        new ApiRsponse(200, createdUser , "User Registered Successfully ")
      )

export { 
    registerUser,
 } 