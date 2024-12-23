import { Router } from "express"

import {registerUser} from "../controllers/user.controller.js"

import {upload} from "../middlewares/multer.middlewares.js"

import {loginUser,LogoutUser} from "../controllers/user.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"

import { refreshAccessToken } from "../controllers/user.controller.js"

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



export default router 

// import in app.js