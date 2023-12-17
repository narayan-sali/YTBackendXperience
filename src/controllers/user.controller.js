import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/ApiResponse.js'




const generateAccessAndRefreshTokens = (async (userId)=>
{
  try{
    const user = await User.findById(userId)
    if (!user) {
      throw new ApiError(404, "User not found");
  }
    const accessToken = await user.generateAccessToken()            
    const refreshToken= await user.generateRefreshToken()
    console.log("accessToken", accessToken)
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})
    return { accessToken , refreshToken}
  } catch (error){
    console.error('Error in generateAccessAndRefreshTokens:', error);
     throw new ApiError (500,"something went wrong while generating access and refresh token")
  }

})
const registerUser = asyncHandler(async (req,res) => {
   const  {fullName , email , username ,  password} = req.body
  
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
   
    // const coverImageLocalPath = await req.files?.coverImage[0]?.path;
   let coverImageLocalPath;
   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0) {
    coverImageLocalPath = req.files.coverImage[0].path
   }
  
   if (!avatarLocalPath){
    throw new ApiError(400 , "Avatar file is required ")
   }

    

        // upload avatar,coverimage to cloudinary
       const avatar = await uploadOnCloudinary(avatarLocalPath)
       
       const coverImage = await uploadOnCloudinary(coverImageLocalPath)
      
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

  // return response
       return  res.status(201).json(
        new ApiResponse (200, createdUser , "User Registered Successfully ")
      )
    });

    const loginUser = asyncHandler(async (req,res)=>{

      // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie
      const {email , username ,password } = req.body

        if (!username && !email ) {
          throw new ApiError (400, "username or email is required")
        }
      //check for user 
        const user = await User.findOne({
          $or: [{username}, {email}]
          
        })
        

        if(!user){
          throw new ApiError (404, "User does not exists")
        }

        const isPasswordValid = await user.isPasswordCorrect(password)
        console.log(isPasswordValid)

        if(!isPasswordValid){
          throw new ApiError (401, "Invalid Credentials")
        }

         const { accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id)
         

         const loggedInUser =await User.findById(user._id).select("-password -refreshToken")

         const options = {
          httpOnly: true,
          secure: true
         }
        
         return res
         .status(200)
         .cookie("accessToken", accessToken , options)
         .cookie("refreshToken", refreshToken , options)
         .json(
          new ApiResponse(
            {
              user: loggedInUser , accessToken , refreshToken
            },
            "User logged In Successfully"
          )
         )
    })
       const logOutUser = asyncHandler(async(req,res)=>{
        await User.findByIdAndUpdate(
          req.user._id,
          {
            $set: {
              refreshToken: undefined
            }
          },
          {
              new : true 
          }
        )
        const options = {
          httpOnly: true,
          secure: true
         }
         return res
         .status(200)
         .clearCookie('accessToken', options)
         .clearCookie('refreshToken', options)
         .json(new ApiResponse (200, {}, "User logged out Successfully"))

       })
export { 
    registerUser,
    loginUser,
    logOutUser
 } 