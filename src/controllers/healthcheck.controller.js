import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    return res.status(200).json(new ApiResponse(200,{},"All thing are correct "))

    // done 29th dec 
})

export {
    healthcheck
    }
    