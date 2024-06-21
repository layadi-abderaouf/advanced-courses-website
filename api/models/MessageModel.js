const mongoose = require('mongoose')


const MessageSchema = mongoose.Schema(
    {
        message :{type :String,required:true},
        chat:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"Chat"
        },
        image:String,
        user:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    },
    {
        timestamps : true
    }
)

const Message = mongoose.model('Message',MessageSchema);

module.exports = Message;