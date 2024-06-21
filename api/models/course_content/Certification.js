const mongoose = require('mongoose')


const CertificationSchema = mongoose.Schema(
    {
        user:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        course:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"Course"
        },
        degree:Number ,
        is_local_course:{type:Boolean,default:false}    
    },
    {
        timestamps : true
    }
)

const Certification = mongoose.model('Certification',CertificationSchema);

module.exports = Certification;