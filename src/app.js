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
export {app}  