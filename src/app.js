import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()
// read documentation 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))  // we use app.use for middleware remember this 


// 3 major config of express
app.use(express.json({limit:"16kb"}))

// when we get data from url problem occur 
app.use(express.urlencoded({extended:true,limit:"16kb"})) // sol to problem 

app.use(express.static("public"))

// not needed that much 
app.use(cookieParser())

// middleware is like checking before sending res to user 

// routes import

import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

//routes declaration
// with use we can use all the router
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)


 // it will pass control to userRouter it will in its file

 
export {app}  
