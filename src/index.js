// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from './db/index.js';
// import  express  from "express";
import {app} from './app.js'
dotenv.config({
    path: './.env'
})



// const app = express()


connectDB()


.then(() =>{

    app.on("error",(error)=>{
        console.log("ERROR", error)
       })
    app.listen(process.env.PORT || 8000, () =>{
        console.log(`⚙️ Server is running at port: ${process.env.PORT}`)
        
    })
}) 
.catch((err) => {
    console.log("MONGO DB CONNECTION FAILED!!!", err)
});











/* first approach
import express from "express"
const app = express()
( async ()=>{
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/{DB_NAME}`)
       app.on("error",(error)=>{
        console.log("ERROR", error)
       })
       app.listen(process.env.PORT,()=>{
         console.log(`APP LISTENING ON PORT  ${process.env.PORT}`)
       })
    } catch(error){
        console.error("ERROR",error)
        throw err
    }
})()
*/