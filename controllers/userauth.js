require("dotenv").config()
const userRouter = require("express").Router();
const {Usermodel}=require("../models/user.models")
const bcrypt=require("bcrypt");
const nodemailer = require("nodemailer");
const jwt=require("jsonwebtoken")
// we have to setup the nodemailer here;
const url = "http://localhost:8080/auth/login";
async function sendEmail(email,details){
try {
  const transport = nodemailer.createTransport({
    service:"gmail",
    auth:{
    type:"OAUTH2",
    user:"anuragupadhyay172912313@gmail.com",
    clientId:process.env.clientId,
    clientSecret:process.env.clientSecret,
    refreshToken: process.env.refreshToken,
    accessToken:process.env.accessToken,

    }
    })
    const mailOptions = {
      from:"anuragupadhyay172912313@gmail.com",
      to:email,
      subject:"Email from anurag upadhyay email authentication services",
      html:`<!DOCTYPE html>
      <html>
      <head>
          <title>Appointment Confirmation</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.6;
                  color: #333;
                  margin: 0;
                  padding: 0;
              }
              h1 {
                  font-size: 28px;
                  color: White;
                  font-weight: bold;
                  font-family:Noto-serif
                  margin-top: 20px;
                  margin-bottom: 20px;
              }
              p {
                  margin-bottom: 10px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f7f7f7;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0,0,0,0.2);
              }
          </style>
      </head>
      <body>
          <div class="container">
            Welcome and thank you very much for registering to our app, please continue with the below link
            to complete your authentication
            "http://localhost:8080/auth/verify/${email}"
          </div>
      </body>
      </html>
    `}
    // this mail is gonna contain the link of verification
    const result = await transport.sendMail(mailOptions);  
return result;
}
catch (error) {
  console.error(error);
}

}











const {validator}=require("../middlewares/validator.middleware")

userRouter.get("/", validator,(req,res)=>{
    res.send({"message":"welcome to auth router"})
})
//-----------------------------login route






userRouter.post("/login",async(req,res)=>{
  const {password,email} = req.body;
  let userExist = await Usermodel.findOne({email});
  console.log(userExist)
  if(userExist){
      console.log(userExist)
  let passwordFromDb = userExist?.password;
  bcrypt.compare(password,passwordFromDb,(err,result)=>{
      if(err){
          console.log(err);
          res.status(500).json({message:"server error"})
      }else{
      console.log(result)
     if(result){
         let accessToken = jwt.sign({email,userId:userExist._id},process.env.SECRET_KEY) 
  
         res.status(200).json({message:"login successfull",accessToken}) 
     }else{
      res.status(400).json({message:"wrong credentials"})
     } 
      }
  })
  }else{
      res.status(200).json({message:"please register first"});
  }
  })
  
  



//.......................verification route
userRouter.get("/verify/:email",async(req,res)=>{
// all you have to do here is to make his email id verified and also give him a token
console.log(req.params.email)
let email = req.params.email;
// res.json({message:"email is verified"});
try {

  await Usermodel.findOneAndUpdate({email},{emailVerified:"verified"});
  res.status(304).redirect("http://127.0.0.1:5500/Masai_Repository/anurag_upadhyay_fw21_0957/unit-7/evaluation/mock9-round1/frontend/index.html");
} catch (error) {
  console.log(`error while login: ${error.message}`);
  res.status(500).json({message:"login failed"});
}
})

// ----------------------------sign up route


userRouter.post("/signup",async(req,res)=>{
let {email,name,password}=req.body
let query=await Usermodel.findOne({email})
try {
  if(!query){
bcrypt.hash(password,5,async(err,hash)=>{
if(err) throw err
let newuser=Usermodel({email,name,password:hash})
await newuser.save();
await sendEmail(email)
res.status(201).json({message:"Account created successfully"})
})
} else{
    return res.status(400).json({message:"user already exists"})
  } 
} catch (error) {
    console.log(`error while creating account :error is ${error}`)
    res.statusCode(500).json({message:"server error,please try again later"})
}
})



module.exports={userRouter}