const mongoose = require('mongoose')

const CourseSchema = mongoose.Schema(
    {
        name :{type :String,required:true},
        image: {
            type: "String",
            default:
              "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        description:String,
        user_id:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        category:{
            type : mongoose.Schema.Types.ObjectId,
            //!!!!!! this is category not course
            ref:"Category"
        },
        price:{type:Number,default:0},
        features:[String],
        requirement:[String],
        coupon:[Object],
        language:{type:String},
        duration:Number,
        type:{type:String,require:true},
        is_deployed:{type:Boolean,default:false},
        is_deleted:{type:Boolean,default:false},
        is_independent:{type:Boolean,default:true},
        parent:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"Course"
        },
        children:{
            type : [mongoose.Schema.Types.ObjectId],
            ref:"Course",
            default:[]
        }
        
    },
    {
        timestamps : true
    }
)





const Course = mongoose.model('Course',CourseSchema);

module.exports = Course;