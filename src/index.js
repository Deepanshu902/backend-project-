//require('dotenv').config({path:'/.env'}) // also do the work but code constitency compromised

import dotenv from "dotenv"
import connectDB from "./db/index.js";


dotenv.config({
    path:'/.env'
})


connectDB().then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("MONGO DB CONNECTION FAILED",err );
    
})





















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