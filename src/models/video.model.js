import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const videoSchema = new Schema (
    {
        videoFile: {
            type: String,//cloudinary
            required: true
        },
        thumbnail: {
            type: String,//cloudinary
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: String,//cloudinary
            required: true
        },
        views: {
            type: Number,//cloudinary
            default: 0
        },
        isPublished: {
            type: Boolean,//cloudinary
            default: true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps:true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)



export const video = mongoose.model("video",videoSchema)