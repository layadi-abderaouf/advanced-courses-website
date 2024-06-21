const asyncHandler = require('express-async-handler');
const Course = require('../models/CourseModel');
const Video = require('../models/course_content/Video');
const Section = require('../models/course_content/Section');
const Enrollement = require('../models/course_content/Enrollement');
const fs = require('fs');
const Quiz = require('../models/course_content/Quiz');
const Question = require('../models/course_content/Question');
const Certification = require('../models/course_content/Certification');
const Comment = require('../models/course_content/Comment');

const new_section = asyncHandler(
    async(req,res)=>{
        const {name,course_id} = req.body
        if(!name || !course_id){
            res.status(404).json('data not find')
        }
        const section = await Section.create({
            name,course:course_id
        })
        if(section){
            res.status(201).json(section)
        }
    }
)
const delete_section = asyncHandler(
    async(req,res)=>{
        const {section_id} = req.query
        if(!section_id){
            res.status(404).json('data not find')
        }
        const section = await Section.findByIdAndDelete(section_id)
      
        res.status(200).json('section deleted')
        
        
    }
)
const getsection = asyncHandler(
    async(req,res)=>{
       const {course_id} = req.query
       if(!course_id){
        res.status(404).json('course id not find')
       }
       const sections = await Section.find({course:course_id}).sort([['createdAt', 1]])
       if(sections){
        res.status(200).json(sections)
       }
    }
)

const update_section = asyncHandler(
    async(req,res)=>{
        const {name,section_id} = req.body
        if(!name || !section_id){
            res.status(404).json('data not find')
        }
        const section = await Section.findByIdAndUpdate(section_id,{name})
        if(section){
            res.status(200).json('section updated')
        }
        
    }
)

const new_video = asyncHandler(
    async(req,res)=>{
        const {name,url,section_id,description,duration,course_id} = req.body
        if(!name || !url || !
            section_id || !course_id){
            res.status(404).json('body not full')
        }
        const video = await Video.create({
            name,url,section:section_id,description,duration,course:course_id
        })
        if(video){
            res.status(201).json(video)
        }
    }
)

const update_video = asyncHandler(
    async(req,res)=>{
        const {name,description,video_id} = req.body
        if(!video_id || !name){
            res.status(404).json('body not defind')
        }
        const video = await Video.findByIdAndUpdate(video_id,{name,description})
        if(video){
            res.status(200).json(video)
        }
    }
)

const delete_video = asyncHandler(
    async(req,res)=>{
        const {video_id} = req.query
        console.log("dd"+video_id);
        if(!video_id){
            res.status(404).json('body not defind')
        }
        const video = await Video.findById(video_id)
        if(!video){
            res.status(404).json('video not defind')
        }
        const url = video.url
        fs.unlink('private/'+url,async(err)=>{
            if(err){
                res.status(400).json(err)
            }else{
                await Video.findByIdAndDelete(video_id)
                res.status(200).json('video deleted !')
            }
        })
    }
)

const get_video = asyncHandler(
    async(req,res)=>{
        
        const {video_id,course_id} = req.query
        if(!video_id && !course_id){
            res.status(404).json('id not defind')
        }
        if(!course_id){
            const video = await Video.findById(video_id)
            if(video){
                res.status(200).json(video)
            }else{
                res.status(404).json('not find')
            }
        }else{
            const videos = await Video.find({course : course_id}).select('-url')
            if(videos){
                res.status(200).json(videos)
            }else{
                res.status(404).json('not find')
            }
        }
        
    }
)


const new_quiz = asyncHandler(
    async(req,res)=>{
        const {name,course_id,section_id} = req.body
        if(!name ||  !course_id){
            res.status(404).json('body not full')
        }
        const quiz = await Quiz.create({
            name,course:course_id,section:section_id
        })
        if(quiz){
            res.status(201).json(quiz)
        }
    }
)

const update_quiz = asyncHandler(
    async(req,res)=>{
        const {quiz_id,name,manual_correction} = req.body
        if(!quiz_id || !name){
            res.status(404).json('body not defind')
        }
        const quiz = await Quiz.findByIdAndUpdate(quiz_id,{name,manual_correction})
        if(quiz){
            res.status(200).json(quiz)
        }
    }
)

const delete_quiz = asyncHandler(
    async(req,res)=>{
        const {quiz_id} = req.query
        if(!quiz_id){
            res.status(404).json('data not find')
        }
        const quiz = await Quiz.findByIdAndDelete(quiz_id)
      
        res.status(200).json('section deleted')
    }
)

const get_quiz = asyncHandler(
    async(req,res)=>{
        
        const {quiz_id,section_id,course_id,is_final} = req.query
        if(!quiz_id && !section_id && !course_id && !is_final){
            res.status(404).json('id not defind')
        }
        //get one
        if(!section_id && !course_id){
            const quiz = await Quiz.findById(quiz_id).populate("course")
            if(quiz){
                res.status(200).json(quiz)
            }else{
                res.status(404).json('not find')
            }
            //get by sections
        }else if(!course_id){
            const quiz = await Quiz.find({section : section_id}).populate("course")
            if(quiz){
                res.status(200).json(quiz)
            }else{
                res.status(404).json('not find')
            }
            //get by course
        }else if(!is_final){
            const quiz = await Quiz.find({course : course_id,is_final:false}).populate("course")
            if(quiz){
                res.status(200).json(quiz)
            }else{
                res.status(404).json('not find')
            }
            //get the final test
        }else {

           
            const quiz = await Quiz.find({course : course_id,is_final:true}).populate("course")
            if(quiz){
                res.status(200).json(quiz)
            }else{
                res.status(404).json('not find')
            }
        }
        
    }
)

const new_question = asyncHandler(
    async(req,res)=>{
        const {question,image,answers,right_answer,quiz_id} = req.body
        if(!question || !answers || !right_answer || !quiz_id){
            res.status(404).json('body not defind')
        }
        try {
            const new_question = await Question.create({quiz:quiz_id,question,image,answers,right_answer})
            if(new_question){
                res.status(201).json(new_question)
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
)

const update_question = asyncHandler(
    async(req,res)=>{
        const {question_id,question,image,ansewers,right_ansewer} = req.body
        if(!question_id || !question || !ansewers || !right_ansewer){
            res.status(404).json('body not defind')
        }
        try {
            const question = await Question.findByIdAndUpdate(question_id,{question,image,ansewers,right_ansewer})
            if(question){
                res.status(200).json(question)
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
)

const delete_question = asyncHandler(
    async(req,res)=>{
        const {question_id} = req.query
        if(!question_id){
            res.status(404).json('body not defind')
        }
        try {
            await Question.findByIdAndDelete(question_id)
            
            res.status(200).json("question deleted")
           
        } catch (error) {
            res.status(500).json(error)
        }
    }
)

const get_questions = asyncHandler(
    async(req,res)=>{
        const {quiz_id} = req.query
        if(!quiz_id){
            res.status(404).json('id not defind')
        }
        try {
            const questions = await Question.find({quiz:quiz_id}).sort([["createdAt",1]])
            
            res.status(200).json(questions)
           
        } catch (error) {
            res.status(500).json(error)
        }
    }
)


const new_certafication = asyncHandler(
    async(req,res)=>{
        const {course_id,degree,is_local_course} = req.body
        if(  !course_id){
            res.status(404).json('body not full')
        }
        const is_exist = await Certification.findOne({course:course_id,user:req.user._id})
        if(is_exist){
            res.status(200).json('user already get this certafication')
        }
        const quiz = await Certification.create({
           degree,course:course_id,user:req.user._id,is_local_course
        })
        if(quiz){
            res.status(201).json(quiz)
        }
    }
)

const new_comment = asyncHandler(
    async(req,res)=>{
        const {video_id,comment,type,comment_id} = req.body
        if(  !video_id || !comment){
            res.status(404).json('body not full')
        }
       
        var _type = "comment"
        if(type){
            _type = type;
        }
       
        const _comment = await Comment.create({
          video:video_id,user:req.user._id,comment,type:_type,comment_id
        })
        if(_comment){
            res.status(201).json(_comment)
        }
    }
)

const get_comments = asyncHandler(
    async(req,res)=>{
        const {video_id} = req.query
        if(!video_id){
            res.status(404).json('id not defind')
        }
        try {
            const comments = await Comment.find({video:video_id}).sort([["createdAt",-1]]).populate('user')
            
            res.status(200).json(comments)
           
        } catch (error) {
            res.status(500).json(error)
        }
    }
)




module.exports = {new_section,update_section,get_video,new_quiz,get_comments,new_comment,
    get_questions,new_question,update_question,delete_question,
    get_quiz,update_quiz,delete_quiz,new_certafication,
    delete_section,getsection,new_video,update_video,delete_video}