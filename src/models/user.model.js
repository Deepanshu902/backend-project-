import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type: String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true  // for enabling searching field 
    },
    email:{
        type: String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
       
    },
    fullname:{
        type: String,
        required : true,
        trim : true,
       
    },

    avatar:{
        type : String,  // cloudinary url 
        required: true,

    },
    coverImge:{
        type: String,
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "video"
        },
       
    ],
    password:{
        type: String,  // we are storing in clear text so this is a problem
        required : [true,'Password is required']
    },

    refreshToken : {
        type: String
    }
},
{timestamps:true})

// this is a hook USING PRE
userSchema.pre("save",async function (next) { // never pass arrow function in this and use async
    if(!this.isModified("password")){ // if password not modified than we return
        return next()
    }
    this.password = bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password){
  return await  bcrypt.compare(password, this.password) // this.password is encrypted one
}

userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id: this._id,
            email:this.email,
            username : this.username // this.username is from database 
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

    
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)