import {asyncHandler} from '../utils/asyncHandler.js'
const registerUser = asyncHandler(async (req,res) => {
  return  res.status(200).json({
    message:"OK"
   })


//    const { fullName , email , username, password} = req.body
//    console.log("email", email)
    
});



export { 
    registerUser,
 } 