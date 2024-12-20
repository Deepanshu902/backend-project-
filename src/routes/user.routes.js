import { Router } from "express"

import {registerUser} from "../controllers/user.controller.js"

import {upload} from "../middlewares/multer.middlewares.js"


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



export default router 

// import in app.js