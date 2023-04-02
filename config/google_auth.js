const GoogleStrategy = require('passport-google-oauth20').Strategy;
require("dotenv").config()
const passport=require("passport");
const { UserModel } = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://wild-gold-betta-fez.cyclic.app/auth/google/callback"
  },
 async function(accessToken, refreshToken, profile, cb) {
    // console.log(profile);
    const email=profile._json.email
    var user=UserModel.findOne({email});
    if(!user.length>0){
      user= new UserModel({email,name:profile._json.name,password:uuidv4()})
       await user.save()
    }
  
      return cb(null,user);
    
  }
));
module.exports={passport}