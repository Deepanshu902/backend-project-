//require('dotenv').config({path:'/.env'}) // also do the work but code constitency compromised

import dotenv from "dotenv"
import connectDB from "./db/index.js";


dotenv.config({
    path:'/.env'
})


connectDB();





















/*
// good approach but prefer to do it in db folder so it remain clean here 
(async ()=>{
    try{ // always put await before connect 
       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    } catch(error){
        console.error("ERROR :",error)
        throw error
    }
})()  // eife  
  */