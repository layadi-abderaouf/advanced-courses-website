const mongoose = require('mongoose')


const SectionSchema = mongoose.Schema(
    {
        course:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"Course"
        },
        name:{
            type : String,
            required:true
        },     
    },
    {
        timestamps : true
    }
)

const Section = mongoose.model('Section',SectionSchema);

module.exports = Section;