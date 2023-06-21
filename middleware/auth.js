const jwt = require("jsonwebtoken")

module.exports = async (req,res,next)=>{
try {

    const authHeader=req.headers.authorization;
    console.log("authorization header ");
    console.log(authHeader);
    if(!authHeader){
        console.log("1")
        return res.status(401).send({
            message:"auth failed",
            status:false
        })
    }
  
     const token =authHeader.split(" ")[1]
     console.log(token,1234);
     jwt.verify(
        token,process.env.JWT_SECRET,
        (err,decode)=>{
            if(err){
                console.log("the token is not the same");
                return res.status(401).json({
                    message:"auth failed",
                    success:false

                })
            }else{
                console.log("3");
                req.body.userId= decode.id
                if(req.body.userId==null){
                    console.log("4")
                    return res.status(200).json({
                        message: "You have no account, Please Login",
                        noAcc: true
                    })
                }else{
                     console.log("5")
                    next()
                }

            }
        }
     )

} catch (error) {
    return res.status(401).json({
        message: "auth failed",
        success: false,
    });
}
}