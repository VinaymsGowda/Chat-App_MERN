import  jwt from "jsonwebtoken"

export default  function genToken(id){
    return jwt.sign({id}, process.env.JWT_secret,{
        expiresIn:"30d",
    });
};