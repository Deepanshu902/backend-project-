import { asyncHandler } from "../utils/asyncHandler.js";

// will repeat for other project also 
const registerUser = asyncHandler( async(req,res)=>{
    res.status(200).json({
        message :"ok"
    })
})



export {registerUser}
// import in app.js