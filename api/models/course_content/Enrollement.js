const mongoose = require('mongoose')


const EnrollementSchema = mongoose.Schema(
    {
        user:{
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

const Enrollement = mongoose.model('Enrollemnt',EnrollementSchema);

module.exports = Enrollement;