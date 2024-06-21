const mongoose = require('mongoose')


const ChatSchema = mongoose.Schema(
    {
        name :{type :String,required:true},
        course:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"Course"
        },
        members:{
            type : [mongoose.Schema.Types.ObjectId],
            ref:"User"
        },
        is_group:{type:Boolean,default:true}
    },
    {
        timestamps : true
    }
)

const Chat = mongoose.model('Chat',ChatSchema);

module.exports = Chat;