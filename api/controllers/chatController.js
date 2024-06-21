const asyncHandler = require('express-async-handler');
const Message = require('../models/MessageModel');
const Chat = require('../models/ChatModel');
const User = require('../models/UserModel');

const get_messages = asyncHandler(
    async(req,res)=>{
       const {chat_id} = req.query
       if(!chat_id){
        res.status(404).json('chat not found')
       }
       const messages = await Message.find({chat:chat_id}).sort([['createdAt',-1]]).populate('user')
       if(messages){
        res.status(200).json(messages)
       }else{
        res.status(404).json('not found')
       }
    }
)
const get_chats = asyncHandler(
    async(req,res)=>{
        const chats = await Chat.find({members:{$elemMatch:{$eq:req.user._id}}}).sort([['createdAt',-1]])
       if(chats){
        res.status(200).json(chats)
       }else{
        res.status(404).json('not found')
       }
    }
)
const new_chat = asyncHandler(
    async(req,res)=>{
        const{user_id}= req.body
        if(!user_id){
            res.status(404)
        }
        const teacher = await User.findById(user_id)
        const is_exist = await Chat.findOne({is_group:false,$and:[{members:{$elemMatch:{$eq:user_id}}},{members:{$elemMatch:{$eq:req.user._id}}}]})
        if(is_exist){
            res.status(200).json(is_exist)
        }else{
            const chat = await Chat.create({is_group:false,members:[user_id,req.user._id],name:req.user.name + "/" + teacher?.name})
            if(chat){
                res.status(200).json(chat)
            }else{
                res.status(500).json('error')
            }
        }
    }
)
const new_message = asyncHandler(
    async(req,res)=>{
        const {image,message,chat_id} = req.body
       if(!chat_id){
            res.status(404)
        }
        const mess = await Message.create({user:req.user._id,message,image,chat:chat_id})
        if(mess){
            res.status(200).json(mess)
        }else{
            res.status(500).json('error')
        }
    }
)
const delete_chat = asyncHandler(
    async(req,res)=>{

    }
)
module.exports = {get_chats,get_messages,new_message,new_chat,delete_chat}