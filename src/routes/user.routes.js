import { Router } from "express"

import {registerUser} from "../controllers/user.controller.js"

import {upload} from "../middlewares/multer.middlewares.js"

import {loginUser,LogoutUser} from "../controllers/user.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"

import { refreshAccessToken } from "../controllers/user.controller.js"

import {changeCurrentPassword} from "../controllers/user.controller.js"

import {getCurrentUser} from "../controllers/user.controller.js"

import {updateAccountDetails} from "../controllers/user.controller.js"

import {updateUserCoverImage} from "../controllers/user.controller.js"

import {getUserChannelProfile, getWatchHistory,updateUserAvatar} from "../controllers/user.controller.js"

const router = Router()


router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),  // upload is middleware 
    registerUser)
router.route("/login").post(loginUser)

//secured routes

router.route("/logout").post(verifyJWT, LogoutUser)

router.route("/refresh-token").post(refreshAccessToken)


router.route("/change-password").post(verifyJWT,changeCurrentPassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/update-account").patch(verifyJWT,updateAccountDetails)  // patch for updating only needed data not full data

router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)

router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)

router.route("/channel/:username").get(verifyJWT,getUserChannelProfile) // coming from prams so problem 

router.route("/watchHistory").get(verifyJWT,getWatchHistory)

export default router 

// import in app.js