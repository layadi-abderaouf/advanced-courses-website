const asyncHandler = require('express-async-handler');
const Course = require('../models/CourseModel');
const Enrollement = require('../models/course_content/Enrollement');
const Quiz = require('../models/course_content/Quiz');
const Video = require('../models/course_content/Video');
const Certification = require('../models/course_content/Certification');
const Chat = require('../models/ChatModel');

const create_course = asyncHandler(
    async(req,res)=>{
        const {name,image,description,user_id,language,parent,is_independent,
            category,price,type,features,requirement} = req.body
        if(!name  || !type || !user_id || !price){
            res.status(404).json('body not defined')
        }

       
        
        if(type === 'simple'){
            const new_course = await Course.create({
                name,
                description,is_independent,
                price,
                category,
                user_id,
                features,
                requirement,
                type,language,
                image,parent
            })
            if(new_course){
                const final_exam = await Quiz.create({
                    name:"final exam",
                    is_final:true,
                    course:new_course._id
                })
                res.status(201).json({course:new_course})
            }
        }else if(type === 'diploma'){
            const new_course = await Course.create({
                name,
                description,
                price,
                category,
                user_id,
                features,
                requirement,
                type,parent,is_independent:true,
                image,language
            })
            if(new_course){
                const final_exam = await Quiz.create({
                    name:"final exam",
                    is_final:true,
                    course:new_course._id
                })
                res.status(201).json({course:new_course})
            }
        }
    }
)

const update_course = asyncHandler(
    async(req,res)=>{
        const {course_id,name,image,description,language,
            category,price,features,requirement} = req.body
        if(!name    || !price){
            res.status(404).json('body not defined')
        }
        
      
        const new_course = await Course.findByIdAndUpdate(course_id,{
                name,
                description,
                price,
                category,
                features,
                requirement,
                image,language
        })
        if(new_course){
            res.status(200).json({course:new_course})
        }
    }
)

const deploy = asyncHandler(
    async(req,res)=>{
        const {course_id} = req.body
        if(!course_id){
            res.status(404).json('id not defind')
        }
        const course = await Course.findById(course_id)
        if(course){
            if(course.type == "diploma"){
                var duration = 0;
               const children = await Course.find({parent:course_id,is_deployed:true})
               if(children){
                children?.forEach((c)=>{
                    if(c.duration){
                        duration += c?.duration;
                    }
                 
                })
               }
               const saved = await Course.findByIdAndUpdate(course_id,{is_deployed:true,duration})
               if(saved){
                const chat = await Chat.find({course:course_id})
                if(!chat.name){
                     await Chat.create({name:saved.name,course:course_id,members:[req.user._id]})
                }
                res.status(200).json(saved)
               }
            }else{
               var duration = 0;
               const videos = await Video.find({course:course_id})
               if(videos){
                videos.forEach((v)=>{
                    if(v.duration){
                        duration += v.duration;
                    }
                    
                })
               }
               const saved = await Course.findByIdAndUpdate(course_id,{is_deployed:true,duration})
               if(saved){
                const chat = await Chat.find({course:course_id})
                if(!chat.name){
                     await Chat.create({name:saved.name,course:course_id,members:[req.user._id]})
                }
                res.status(200).json(saved)
               }
            }
           
            res.status(500).json("error")
            
        }else{
            res.status(404).json('course not defind')
        }
    }
)

const add_children = asyncHandler(
    async(req,res)=>{
        const {course_id,parent} = req.body
        if(!parent || !course_id){
            res.status(404).json('body not defind')
        }

        const course = await Course.findById(course_id)
        if(course){
            if(course.parent){
                if(!course.is_independent){
                    await Course.findByIdAndDelete(course_id)
                    res.status(200).json('deleted')
                }
                course.parent = undefined;
                
            }else{
                course.parent = parent;
            }
            const saved = await course.save()
            if(saved){
                res.status(200).json(saved)
            }
            
        }else{
            res.status(500).json('error')
        }
    }
)

const get_courses = asyncHandler(
    async(req,res)=>{
        const {user,course,diploma,orderby,search,page,is_teacher,lang} = req.query
      
      
        //get all
        if(!user && !course && !diploma){
            const regex = new RegExp(search, 'i');
            var lang_regex;
            if(lang && lang !== "all"){
                 lang_regex = new RegExp(lang, 'i');
            }else {
                 lang_regex = new RegExp("", 'i');
            }
           
            let orderby_query = ['updatedAt', -1]
            switch (orderby) {
               case "1":
                  orderby_query = ['updatedAt', -1]
                  break;
               case "2":
                  orderby_query = ['updatedAt', 1]
                  break;
               case "3":
                  orderby_query = ['price', -1]
                  break;
               case "4":
                  orderby_query = ['price', 1]
                  break;
            }
            const courses = await Course.find({$or :[{name:regex},{description:regex}],is_independent:true,is_deleted:false,is_deployed:true,language:lang_regex})
            .sort([orderby_query]).skip(page * 10).limit(10).populate('user_id').populate('category')
            if(courses){
                res.status(200).json(courses)
            }
        //get one
        }else if(!user && !diploma){
            const courses = await Course.findById(course).populate('category').populate({path:'user_id',populate:{path:"teacher_id",model:"Teacher"}})
            if(courses){
                res.status(200).json(courses)
            }
        //get all for a spesific user
        }else if(!diploma){
            var courses = []
            if(is_teacher){
                 courses = await Course.find({user_id:user,is_deleted:false,is_independent:true}).populate('user_id')
            }else{
                courses = await Course.find({user_id:user,is_deleted:false,is_deployed:true}).populate('user_id')
            }
         
            if(courses){
                res.status(200).json(courses)
            }
        //get all for a spesific diploma
        }else{
            console.log(is_teacher);
            var courses = []
            if(is_teacher){
                courses = await Course.find({parent:diploma,is_deleted:false}).populate('user_id')
            }else{
                courses = await Course.find({parent:diploma,is_deleted:false,is_deployed:true}).populate('user_id')
            }
            
            if(courses){
                res.status(200).json(courses)
            }
        }
    }
)

const free_enroll = asyncHandler(
    async(req,res)=>{
       const {course_id} = req.body;
       if(!course_id){
        res.status(404).json('course id not find')
       }
       const is_enrolled = await Enrollement.findOne({user:req.user._id,course:course_id})
       if(is_enrolled?.user === req.user._id && is_enrolled?.course === course_id){
        res.status(400).json('you have already enrolled!')
       }
       const course = await Course.findById(course_id)
       if(course){
      
        if(course.price != 0){
            res.status(400).json('you must buy the course before')
        }else if(course.price === 0){
            const enroll = await Enrollement.create({
                course:course_id,user:req.user._id
               })
               if(enroll){

                const chat= await Chat.findOne({course:course_id})
                if(chat){
                    chat.members?.push(req.user._id)
                    await chat.save();
                    res.status(201).json(enroll)
                }
               
               }
        }
       }
       
    }
)

const is_enroll = asyncHandler(
    async(req,res)=>{
       const {course_id,parent_id} = req.body;
       if(!course_id && !parent_id){
        res.status(402).json('course id not find')
       }
       if(parent_id){
           const course = await Course.findById(course_id)
           if(course){
            
            if(course.parent == parent_id){
              const new_enroll = await Enrollement.create({
                course:course_id,user:req.user._id
              })
              if(new_enroll){
                res.status(200).json(true)
              }else{
                res.status(500).json('error')
              }
             
             }else{
              res.status(200).json(false)
             }
           }else{
            res.status(200).json(false)
           }
          
       }else{
              const is_enrolled = await Enrollement.findOne({user:req.user._id,course:course_id})
              if(is_enrolled){
          
            res.status(200).json(true)
           }else{
            res.status(200).json(false)
           }
       }
      
    
       
    }
)

const get_user_enrollemnt = asyncHandler(
    async(req,res)=>{
        const enrollemnts = await Enrollement.find({user:req.user._id}).sort([['createdAt',1]]).populate('course')
        if(enrollemnts){
            res.status(200).json(enrollemnts)
        }else{
            res.status(404).json('not defind')
        }
    }
)

const get_user_certification = asyncHandler(
    async(req,res)=>{
        const certifications = await Certification.find({user:req.user._id,is_local_course:false}).sort([['createdAt',1]]).populate('course')
        if(certifications){
            res.status(200).json(certifications)
        }else{
            res.status(404).json('not defind')
        }
    }
)


module.exports = {get_user_enrollemnt,get_user_certification,create_course,deploy,get_courses,update_course,free_enroll,add_children,is_enroll}