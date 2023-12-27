import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'



cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        //upload the file on cloudinary 
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto"
            
    
    })
    // console.log("Cloudinary response:", response);
    //    // file has been uploaded successfully
    //    console.log("file uploaded on cloudinary",response.url)
     fs.unlinkSync(localFilePath)
       return response
    } catch(error){
        // console.error("Cloudinary upload error:", error);
        fs.unlinkSync(localFilePath)//remove the locally saved temporary file as the upload operation got failed
        return null
    }
}


const deleteFromCloudinary = async(publicId)=>{
  try{
       if(!publicId) return null 
       const result = await cloudinary.uploader.destroy(publicId);
       if (result.result === 'ok') {
        console.log(`File with publicId ${publicId} deleted from Cloudinary`);
      } else {
        console.error(`Error deleting file from Cloudinary: ${result.result}`);
        throw new Error(`Error deleting file from Cloudinary: ${result.result}`);
      }
  }catch(error){
    console.error('Error deleting file from Cloudinary:', error.message);
    throw error;

  }
}

export {uploadOnCloudinary,deleteFromCloudinary}





