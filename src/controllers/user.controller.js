import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
// will repeat for other project also 
const registerUser = asyncHandler( async(req,res)=>{
   const {fullname,email,username,password} = req.body

  if(
   [fullname,email,username,password].some((item)=>{
      item?.trim() ===""
   })
  ){
      throw new ApiError(400,"All fields are required");
      
  }
 const existedUser = await User.findOne({
      $or:[{username} , {email}] // work like or 
   })

   if(existedUser){
      throw new ApiError(409,"Already Exist")
   }
   const avatarLocalPath =req.files?.avatar[0]?.path;  // using multer and handling files
  // const coverImageLocalPath = req.files?.coverImage[0]?.path; give error if not uploaded canot access [0] undefined something
   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
      coverImageLocalPath = req.files.coverImage[0].path
   }


   if(!avatarLocalPath){
      throw new ApiError(400,"Avatar file is req")
   }

   const avatar= await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
      throw new ApiError(400,"Avatar file is req")
   }

   const user =await  User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || " ",
      email,
      password,
      username: username.toLowerCase()
   })
 const createdUser = await User.findById(user._id).select(
   "-password -refreshToken"   // - jis ke aage vo nhi chaiye
 )  // db by itself add _id field when data entry created

   if(!createdUser){
      throw new ApiError(500,"Something went wrong ")
   }

   return res.status(201).json(
      new ApiResponse(200,createdUser,"User Registered") // using api response file
   )


})



export {registerUser}
// import in app.js


    // in registerUser function
    // steps to register 
    // get user details
    // validation - not empty
    // check if user already exists username and email
    // check for images , check for avatar 
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from res
    // check for user creation
    // return res 