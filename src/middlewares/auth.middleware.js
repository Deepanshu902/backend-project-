
import { asyncHandler } from "../utils/asyncHandler" ; 
import { jwt } from "jsonwebtoken";

import { User} from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async(req,res,next)=>{
   try {
    const token =  req.cookies?.accessToken  || req.header("Authorization")?.replace("Bearer ","")
 
     if(!token){
         throw new ApiError(401,"unauthorized")
     }
 
     const decodedToken  = await  jwt.verify(token,proccess.env.ACCESS_TOKEN_SECRET)
 
      const user =   await User.findById(decodedToken?._id).select("-password -refreshToken")
 
 
     if(!user){
     throw new ApiError(401,"invalid access token")
  }
 
     req.user  =user
     next() // my work is done now go to other route  see user.route file
   } catch (error) {
    throw new ApiError(401,error?.message || "invalid access token ") 
    
   }
})


// work for logout 
// remove cookie and also remove refresh tokken and access tokken from db