const jwt = require("jsonwebtoken")

module.exports = async (req,res,next)=>{
try {

    const authHeader=req.headers.authorization;
    console.log("authorization header ");
    console.log(authHeader);
    if(!authHeader){
        return res.status(200).send({
            message:"auth failed",
            status:false
        })
    }
  
     const token =authHeader.split(" ")[1]
     jwt.verify(
        token,process.env.JWT_SECRET,
        (err,decode)=>{
            if(err){
                return res.send({
                    message:"auth failed",
                    success:false

                })
            }else{
                req.body.userId= decode.id
                if(req.body.userId==null){
                    return res.status(200).send({
                        message: "You have no account, Please Login",
                        noAcc: true
                    })
                }else{

                    next()
                }

            }
        }
     )

} catch (error) {
    return res.status(401).send({
        message: "auth failed",
        success: false,
    });
}
}