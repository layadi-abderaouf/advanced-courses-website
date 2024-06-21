const mongoose = require('mongoose')


const QuestionSchema = mongoose.Schema(
    {
        question:String,
        image:String,
        answers:[String],
        right_answer:String,
        quiz:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"Quiz"
        },
        /*course:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"Course"
        },   */  
    },
    {
        timestamps : true
    }
)

const Question = mongoose.model('Question',QuestionSchema);

module.exports = Question;