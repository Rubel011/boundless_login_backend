const express=require("express");
const { connection } = require("./db");
const { authentication } = require("./middleware/authentication");
const { userRoute } = require("./routes/userRoute");
const cookieParser = require('cookie-parser')
const cors=require("cors");
const app=express();
app.use(express.json())
app.use(cors())
app.use(cookieParser())
const port=process.env.port;
require('dotenv').config();
const expressWinston= require("express-winston")
const winston= require("winston");
require("winston-mongodb")
const {passport}=require("./config/google_auth")
const jwt = require("jsonwebtoken");
// app.use(expressWinston.logger({
//     transports: [
      // new winston.transports.File({
      //   level:"info",
      //   json:true,
      //   filename:"alllogs.json"
      // }),
  //     new winston.transports.MongoDB({
  //       level:"silly",
  //       db:process.env.mongoUrl,
  //       json:true
       
  //     })
  //   ],
  //   format: winston.format.combine(
  //     winston.format.colorize(),
  //     winston.format.json()
  //   ),
  // }));


// this is the home route---
app.get("/",(req,res)=>{
    res.send("home page");
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login',session:false }),
  function(req, res) {
    // Successful authentication, redirect home.
    const {id}=req.user
    const  authToken = jwt.sign({ userId: id }, process.env.accessKey,{ expiresIn: '1h' });
const  refreshToken = jwt.sign({ userId: id}, process.env.refreshKey,{ expiresIn: "21 days" });
res.cookie('authToken',authToken,{expires:new Date(Date.now()+50000000)})
res.cookie("refreshToken",refreshToken);
    res.redirect('https://eclectic-melomakarona-f2db1e.netlify.app/lobby.html');
  });
// attaching the user login and register routes----
app.use("/users",userRoute)
// user authentication----
app.use(authentication)

app.get("/check",async(req,res)=>{
  try {
    res.status(200).send({success:"successful"})
  } catch (error) {
    res.status(404).send({err:error})
  }
  
})
// listening and creating the mongosse connection
app.listen(port,async()=>{
    try {
        await connection
        console.log(`server is running at port ${port}`);
    } catch (error) {
        console.log({"err":error});
        
    }

})