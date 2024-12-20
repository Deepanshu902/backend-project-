// In promise format
// use chatgpt to understand it more 
const asyncHandler = (requestHandler) =>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }
}

//     // wraper function
// const asyncHandler = (func) =>async(req,res,next)=>{ 
//     // take a func and pass it to other async funciton
//     try{
//             await func(req,res,next)
//     }
//     catch(error){
//         res.status(err.code || 500).json({
//             success : false,
//             message : err.message
//         })
//     }
    

// }

export {asyncHandler}

