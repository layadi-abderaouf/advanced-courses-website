const mongoose = require('mongoose')


const QuizSchema = mongoose.Schema(
    {
        name:String,
        is_final:{type:Boolean,default:false},
        manual_correction:{type:Boolean,default:false},
        section:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        course:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"Course"
        },     
    },
    {
        timestamps : true
    }
)

const Quiz = mongoose.model('Quiz',QuizSchema);

module.exports = Quiz;