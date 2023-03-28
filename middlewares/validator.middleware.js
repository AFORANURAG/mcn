require("dotenv").config
const jwt=require("jsonwebtoken")
const validator= async (req,res,next)=>{
const token=req.headers?.authorization.split(" ")[0];
try{
        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
        try {
            if (err) throw err
         if(decoded){
    console.log(decoded.emailid)
     if(!req.body.email){
        req.body.email=decoded.email;
        req.body.userid = decoded.userid;
     }
     next()
     
         }else{
             res.send({"message":"Please send a valid token"});
         }

        }catch (error) {
            console.log(`error while decoding the token`);
        }

         

        }) 
     
     } catch (error) {
         console.log(error)
        //error=jwt expired;
        // 
         res.send({"message":"Please login ",err:error.message})
     }
}




module.exports={validator}