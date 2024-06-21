const mongoose = require('mongoose')


const TeacherSchema = mongoose.Schema(
    {
        user_name :{type :String,required:true,unique:true},
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
        balance:{type:Number,default:0},
        freze_balance:{type:Number,default:0},
        ads_revenu:{type:Boolean,default:false}
        
    },
    {
        timestamps : true
    }
)





const Teacher = mongoose.model('Teacher',TeacherSchema);

module.exports = Teacher;