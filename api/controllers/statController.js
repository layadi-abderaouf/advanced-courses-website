const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const Enrollement = require('../models/course_content/Enrollement');
const Course = require('../models/CourseModel');

const get_transaction = asyncHandler(
    async(req,res)=>{

        if(req.user._id == process.env.ADMIN){
          
           const transaction = await Transaction.find({status:true})
           if(transaction){
              res.status(200).json(transaction)
           }else{
            res.status(404).json('not found')
           }
        }else{
            console.log('526');
            const transaction = await Transaction.find({user_id:req.user.teacher_id,status:true}).sort([['updatedAt',-1]])
            if(transaction){
               res.status(200).json(transaction)
            }else{
             res.status(404).json('not found')
            }
        }
    }
)

const get_enrollements = asyncHandler(
    async(req,res)=>{
        const{course_id}=req.query
        if(course_id){
            const enrollements = await Enrollement.find({course:course_id}).sort([['createdAt',-1]]).populate('user')
            if(enrollements){
                res.status(200).json(enrollements)
            }else{
                res.status(404).json('not found')
            }
        }else{
            const enrollements = await Enrollement.find({user:req.user._id})
            const courses = await Course.find({user_id:req.user._id})
            if(enrollements){
                res.status(200).json({enroll:enrollements.length,courses:courses.length})
            }else{
                res.status(404).json('not found')
            }
        }
    }
)



module.exports = {get_enrollements,get_transaction}