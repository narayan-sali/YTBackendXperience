import mongoose , {Schema} from "mongoose";
import jwt from"jsonwebtoken"
import bcrypt from"bcrypt"

const userSchema = new Schema(
    {
        username : {
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email : {
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            
        },
        fullName : {
            type: String,
            required:true,
            unique:true,
            trim:true,
            index:true
        },
        avtar: {
            type: String,//cloudinary
            required: true,

        },
        coverImage: {
            type: String,//cloudinary
            

        },
        watchHistory:[{
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
        password: {
            type:String,
            required:[true, "Password is required"]
        },
        refreshToken:{
            type:String
        }
},
{
    timestamps:true
}
)

//hook
userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)  ////encryption 
    next()

})


//custom method
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            _id:this.id,///payload
            email: this.email,///payload
            userame:this.username,///payload
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_SECRET
        }

    )
}



userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        {
            _id:this.id,///payload
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_SECRET
        }

    )
    }




export const User = mongoose.model("User", userSchema )