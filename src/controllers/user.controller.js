import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

import jwt from "jsonwebtoken"
// will repeat for other project also 





const  generateAccessAndRefreshTokens = async(userId)=>{
   try{
      const user = await User.findOne(userId)
    const accessToken =  user.generateAccessToken()
     const refreshToken=  user.generateRefreshToken()

      user.refreshToken = refreshToken // save value to db 
      await  user.save({ validateBeforeSave : false })  // save the updated user
      // dont do any validation just save the user

      return {refreshToken,accessToken}

   }
   catch(error){
      throw new ApiError(501,"Something went wrong while generating refresh and access token ")
   }
}







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



const loginUser = asyncHandler(async(req,res)=>{
      const {email,username,password} = req.body
      if(!username && !email){
         throw new ApiError(400,"Username or email is req")
      }

    const user =  await User.findOne({
         $or : [{email},{username}]
      })
         // User is from mongo so findOne method work but user is our so only our created method work not findOne which is from mongo
      if(!user){
         throw new ApiError(404,"User dont exist")
      }

      const isPasswordValid = await user.isPasswordCorrect(password)

      
      if(!isPasswordValid){
         throw new ApiError(401,"Password incorrect")
      }

    const {refreshToken,accessToken} =  await generateAccessAndRefreshTokens(user._id)  // method created become this is common 


      // see if using db query expensive so just update operation 
      // decide based on project
      const loggedInUser = await User.findById(user._id).select(
         "-password -refreshToken"
      )


      // sending cookies

      const options = {
         httpOnly:true,  // anyone can modifiy cookie from frontend but after after this frontend can only see
         secure:true
      }
      return res.status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(
         new ApiResponse(200,
            {
            user:loggedInUser,accessToken,refreshToken  // good practise to send them seperately also after sending cookie
         },
         "User Logged In Successfully"
      )
      )
   })


   const LogoutUser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
      req.user._id,
      {
         $set:{
            refreshToken: undefined
         }
         },
         {
            new: true
         }
      
    )
    const options = {
      httpOnly:true,  // anyone can modifiy cookie from frontend but after after this frontend can only see
      secure:true
   }

   return res.status(200).
   clearCookie("accessToken",options).
   clearCookie("refreshToken",options).
   json(new ApiResponse(200,{},"User Logged out"))

   })

   const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken =   req.cookie.refreshToken

   try {
       if(!incomingRefreshToken){
         throw new ApiError(401,"No incoming refresh Token")
       }
   
     const decodedToken =   jwt.verify(
         incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET
       )
     const user =  await User.findById(decodedToken?._id)
       if(!user){
         throw new ApiError(401,"No incoming refresh Token")
     }
   
      if(incomingRefreshToken !== user?.refreshToken){
         throw new ApiError(401,"Refresh Token expired or used")
      }
   
     const {newrefreshToken,accessToken}= await generateAccessAndRefreshTokens(user._id)
   
   
      const options = {
         httpOnly:true,
         secure:true
      }
   
      return res.status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",newrefreshToken,options)
      .json(
         new ApiResponse(200,{
            accessToken,   refreshToken :newrefreshToken
         },
      "Access token refreshed"
   )
      )
   } catch (error) {
      throw new ApiError(401, error?.message ||"Error")
   }

   })

  const changeCurrentPassword = asyncHandler(async(req,res)=>{
   const {oldPassword,newPassword}= req.body

  const user = await User.findById(req.user?.ACCESS_TOKEN_EXPIRYid)
    const isPasswordCorrect = await  user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
       throw new  ApiError(400,"Old password not correct")
    }
    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res.status(200).json(new ApiResponse(200,{},"Password Changed Successfully"))
    })
   
    const getCurrentUser = asyncHandler(async(req,res)=>{
      return res.status(200).json(new ApiResponse(200,req.user,"CurrentUser Fetch successfully"))
    })


    const updateAccountDetails = asyncHandler(async(req,res)=>{
      const {fullname,email} = req.body

      if(!fullname && !email){
         throw new ApiError(401,"all feilds are req")
      }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set:{
            fullname: fullname ,
             email : email
         }
      },
      {new:true}
     ).select("-password  ")

     return res.status(200).json(new ApiResponse(200,user,"Account Details Updated"))
    })


    const updateUserAvatar = asyncHandler(async(req,res)=>{
      const avatarLocalPath = req.file?.path

      if(!avatarLocalPath){
         throw new ApiError(400,"Avatar file is missing")
      }

      // this delete using chatgpt code so understand it from there

      // can have error for new user didn't checked for now if there is error i will update it
      const user = await User.findById(req.user._id);
      const oldAvatarPublicId = user.avatar?.split("/").pop().split(".")[0];

     const avatar = await uploadOnCloudinary(avatarLocalPath,oldAvatarPublicId)


      if(!avatar.url){
         throw new ApiError(400,"Error while uploading avatar")
      }

        const updatedUser =  await User.findByIdAndUpdate(req.user._id,
         {
            $set :{
              avatar: avatar.url  // in model we take it string and cloudinary provide object so we use avatar.url for url 
            }
         },
         {new : true}
      ).select("-password")

      return res.status(200).json(new ApiResponse(200,user,"Avatar Uploaded"))

    })




    const updateUserCoverImage = asyncHandler(async(req,res)=>{
      const coverImageLocalPath = req.file?.path
      if(!coverImageLocalPath){
         throw new ApiError(400,"cover Image file is missing")
      }

      const user = await User.findById(req.user._id);
      const oldCoverImagePublicId = user.coverImage?.split("/").pop().split(".")[0];


     const coverImage = await uploadOnCloudinary(coverImageLocalPath,oldCoverImagePublicId)


      if(!coverImage.url){
         throw new ApiError(400,"Error while uploading avatar")
      }

    const updatedUser =  await User.findByIdAndUpdate(req.user._id,
         {
            $set :{
              coverImage: coverImage.url  // in model we take it string and cloudinary provide object so we use avatar.url for url 
            }
         },
         {new : true}
      ).select("-password")

      return res.status(200).json(new ApiResponse(200,user,"CoverImage Uploaded"))
    })


    const getUserChannelProfile = asyncHandler(async(req,res)=>{
      const {username} = req.params

      if(!username?.trim()){
         throw new ApiError(401,"Username missing")

      }
      // we get array when aggregating
      // some advanced topic herer
          const channel =  await  User.aggregate([  
      {
               $match:{
                  username : username?.toLowerCase()
               }
      },
      {
         $lookup:{
            from:"subscriptions",
            localField: "_id",
            foreignField:"channel",
            as:"subscribers"
         }
      },
      {
         $lookup:{
            from:"subscriptions",
            localField: "_id",
            foreignField:"subscriber",
            as:"subscribedTo"
         }
      },
      {
         $addFields:{
            subscribersCount :{
               $size:"$subscribers"
            },
            channelsSubscribedToCount:{
               $size: "$subscribedTo"
            },
            isSubscribed:{
               $cond :{
                  if: {$in : [req.user?._id, "$subscribers.subscriber"]}, // in can see in array as well as objects
                  then : true,
                  else : false
               }
            }
         }
      },
      {
         $project : {  // show the value it is projection   . which value you want to show just give it 1 
            fullname : 1,
            username : 1,
            subscribersCount : 1,
            channelsSubscribedToCount : 1,
            isSubscribed : 1,
            avatar : 1,
            coverImage : 1,
            
         }
      }
      ])
    if(!channel?.length()){
      throw new ApiError(401,"Channel Doesn't exist")
   }
         return res.status(200)
         .json(new ApiResponse(200,channel[0,"User channel Fetched successfully"]))

    })

    // very advanced
    const getWatchHistory = asyncHandler(async(req,res)=>{
     // req.user._id // interview we get mongodb objectid which is string but we are using moongoose so it automatically convert it and do work

      const user = await User.aggregate([ // but in aggregration mongo work not moongose so we have to convert this _id 
         {
            $match:{
               _id :new mongoose.Types.ObjectId(req.user._id)
            }
         },
         {
            $lookup:{
               from:"videos",
               localField:"watchHistory",
               foreignField:"_id",
               as : "watchHistory",
               pipeline: [ // sub pipeline 
                  {
                        $lookup:{
                           from:"users",
                           localField:"owner",
                           foreignField:"_id",
                           as:"owner",
                           pipeline: [ // now owner field only have fullname,username,avatar not all the data like password ,refresh token
                              {
                                 $project:{
                                    fullname:1,
                                    username:1,
                                    avatar:1 
                                 }
                              }
                           ]
                     
                        }
                  },
                  {  // only for frontend easyness  as with this array dont go only its 0 element goes to frontend
                     $addFields:{
                        owner:{
                           $first:"$owner"
                        }
                     }
                  }
               ]
            }
         }
      ])
      return res.status(200)
      .json(new ApiResponse(200,user[0].watchHistory,"Watch history fetched successfully")
   )
    })


export {
   registerUser,
   loginUser,
   LogoutUser,
   refreshAccessToken,
   getCurrentUser,
   changeCurrentPassword,
   updateAccountDetails,
   updateUserAvatar,
   updateUserCoverImage,
   getUserChannelProfile,
   getWatchHistory

}
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



    // Login todo
    // get email or username 
    // check if email or username exist in db
    //if yes then check password and login the user 
    // access token and refresh token
    //send cookies
    //if no tell them to register