const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')
const asuncHendler = require('express-async-handler')


const user_required = asuncHendler(async (req,res,next)=>{
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token = req.headers.authorization.split(" ")[1]
           /* if(token.startsWith('Bearer ')){
                token = token.slice(7,token.length).trimLeft();
            }*/
            //decoded token id
            const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)

            req.user = await User.findById(decoded.id).select('-password')
            next();
        } catch (error) {
            res.status(401)
            throw new Error('not authorized , token failed')
        }
    }
    if(!token){
        res.status(401)
        throw new Error('not authorized , no token')
    }
})
const teacher_required = asuncHendler(async (req,res,next)=>{
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try {

            
            token = req.headers.authorization.split(" ")[1]
            //decoded token id

          
            const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
            
            const user = await User.findById(decoded.id).select('-password')
            req.user = user;
            if(user.is_teacher){
                next();
            }else{
                res.status(401)
                throw new Error('not authorized , you are not a teacher')
            }
            
        } catch (error) {
            res.status(401)
            throw new Error('not authorized , token failed')
        }
    }
    if(!token){
        res.status(401)
        throw new Error('not authorized , no token')
    }
})


module.exports = {user_required,teacher_required}