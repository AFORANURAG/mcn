const mongoose=require("mongoose")
const userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    emailVerified:{type:String,enum:["verified","not verified"],default:"not verified"}
},{versionKey:false})


const Usermodel=mongoose.model("user",userSchema)

module.exports={Usermodel}