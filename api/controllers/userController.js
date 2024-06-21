//this is the controller for the basic account
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs')
const emailValidator = require('email-validator');
const token = require('../config/token');
const User = require('../models/UserModel');
const Teacher = require('../models/TeacherModel');


//register
const register = asyncHandler(
    async (req,res)=>{
        const {name,email,password} = req.body
        if(!name || !email || !password){
            res.status(400);
            throw new Error('please enter all field require')
        }

        const userExist = await User.findOne({email})
        if(userExist){
            res.status(400);
            throw new Error('user already exist')
        }
        if (!emailValidator.validate(email)) {
            res.status(400);
            throw new Error('please enter valid email address')
        } 

        const user = await User.create({
            name,email,password
        })
        if(user){
            res.status(201).json({
                _id : user._id,
                name:user.name,
                email:user.email,
                is_teacher:user.is_teacher,
                token :token(user._id)
            })
        }else{
            res.status(401)
            throw new Error('faild to create user')
        }
    }
) 




//login
const login = asyncHandler(
    async (req,res)=>{
        const {email,password} = req.body
        try {
            const user = await User.findOne({email}).populate("teacher_id")
            
            const isMatch = await bcrypt.compare(password,user?.password)
            if( isMatch){
                res.status(200).json({
                    _id : user._id,
                    name:user.name,
                    email:user.email,
                    is_teacher:user.is_teacher,
                    teacher:user?.teacher_id,
                    token :token(user._id)
                })
            }else{
                res.status(401);
                throw new Error('email or password incorect')
            }
        } catch (error) {
            res.status(401);
            throw new Error(error.message)
        }
       
       
    }
) 



//become a teacher
const become_teacher = asyncHandler(
    async(req,res)=>{
        const {user_name,description,img} = req.body 
        if(!req.user || req.user.is_teacher){
            res.status(404);
            throw new Error('error : user not find or already a teacher')
        }
        const new_teacher = await Teacher.create({
          user_name,description,user_id:req.user._id,image:img
        })
        if(new_teacher){ 
            
            const updated_user = await User.findByIdAndUpdate(req.user._id,{
                is_teacher:true,
                teacher_id:new_teacher._id
            })
            
           
            res.status(201).json({
                _id : updated_user._id,
                name:updated_user.name,
                email:updated_user.email,
                is_teacher:true,
                teacher:new_teacher,
                token :token(updated_user._id)
            })
        }
    }
)

const update_user = asyncHandler(
    async(req,res)=>{
        const {name,email,phone} = req.body
        if(!name || !email ){
            res.status(400);
            throw new Error('please enter all field require')
        }

        const userExist = await User.findOne({email})
        if(!userExist){
            res.status(404);
            throw new Error('user not exist')
        }
        if (!emailValidator.validate(email)) {
            res.status(400);
            throw new Error('please enter valid email address')
        } 

        const user = await User.findByIdAndUpdate(req.user._id,{
            name,email,phone
        })
        if(user){
            res.status(200).json({
                _id : user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                is_teacher:user.is_teacher,
                token :token(user._id)
            })
        }else{
            res.status(401)
            throw new Error('faild to update user')
        }
    }
)

const change_password = asyncHandler(
    async(req,res)=>{
       const {old_password,new_password} = req.body
       if(!old_password || !new_password){
        res.status(404).json('password not defind')
       }
       const user = await User.findById(req.user._id)
       if(user){
        const isMatch = await bcrypt.compare(old_password,user?.password)
        if(isMatch){
            var password;
            const salt = await bcrypt.genSalt(10)
            password = await bcrypt.hash(new_password,salt)
            const saved = await User.findByIdAndUpdate(user._id,{password:password})
            if(saved){
                res.status(200).json("password changed!")
            }else{
                res.status(500).json('error')
            }
        }else{
            res.status(500).json('password not match')
        }
       }else{
        res.status(404).json('user not defind')
       }
      
    
    }
)

const get_teacher = asyncHandler(
    async(req,res)=>{
        const {id} = req.query
        if(!id){
            res.status(404).json('id not defind')
        }
        const teacher = await Teacher.findById(id)
        if(teacher){
            res.status(200).json(teacher)
        }else{
            res.status(404).json('teacher not defind')
        }
    }
)


module.exports = {register,login,become_teacher,update_user,change_password,get_teacher}
