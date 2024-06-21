const mongoose = require('mongoose')


const CommentSchema = mongoose.Schema(
    {
        comment:String,
        user:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        video:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"Video"
        },
        type:{type:String,default:"comment"},
        comment_id:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        },
    },
    {
        timestamps : true
    }
)

const Comment = mongoose.model('Comment',CommentSchema);

module.exports = Comment;