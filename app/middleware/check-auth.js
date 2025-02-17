const jwt = require('jsonwebtoken');
require("dotenv").config();
module.exports = (req,res,next)=> {
    try {
        const token = req.headers.authorization.split(" ")[1];
        //const verify = jwt.verify(token,"This is dummy text")
       const verify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        next();

    }
    catch(error){
        return res.status(401).json({
            msg:"invalid token"
        })
    }
}