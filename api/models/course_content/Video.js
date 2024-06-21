const mongoose = require('mongoose')


const VideoSchema = mongoose.Schema(
    {
        section:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"Section"
        },  
        course:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"Course"
        },  
        name:String,
        description:String,
        url:String,
        duration:Number   
    },
    {
        timestamps : true
    }
)

const Video = mongoose.model('Video',VideoSchema);

module.exports = Video;