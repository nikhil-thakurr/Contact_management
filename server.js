const express= require('express');
const errorHandler = require('./middleware/errorHandler');
const dotenv=require('dotenv').config();
const port= process.env.PORT||5000 ;
const connectDb=require("./config/dbConnection")

connectDb();
const app=express();

//body parser middle ware 
//isse hme req.body se data miljaega
app.use(express.json());
//custom middleware hai ye 

// res.send("hogya bhai");
    // res.json({
    //     "Message": "Get All Contacts"
    // });
app.use("/api/contacts",require("../Contact_Manager/Routes/contactRoutes"));
app.use("/api/users",require("../Contact_Manager/Routes/userRoutes"));
app.use(errorHandler)



app.listen(port,()=>{
    console.log(`Listening on ${port}`)
})