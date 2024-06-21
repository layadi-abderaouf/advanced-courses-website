const { writeFile } = require('fs/promises')
const asyncHandler = require('express-async-handler');
const buffer =  require('micro')
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require('fs')
const fsPromises = require('fs/promises')

const upload =asyncHandler( async(req,res)=>{
    const files = req.files
    const {type} = req.query
    var folder = 'files'
    var root = 'public/'
    if(type === "profile_img"){
        folder = 'profile'
    }else if(type === "course_img"){
        folder = 'course-img'
    }else if(type === "question_img"){
    folder = 'question-img'
    }
    else if(type === "chat_img"){
        folder = 'chat-img'
        }
    else if(type === "video"){
        folder = "video"
        root = 'private/'
    }
    console.log(files);
    Object.keys(files).forEach(async(key) => {
        var utc = new Date().toJSON().slice(0,10).replace(/-/g,'-');
        const filepath = path.join(root, folder, utc+'-'+files[key].name)
        files[key].mv(filepath, (err) => {
            if (err) return res.status(500).json({ status: "error", message: err })
        })
       
      

        const start = files[key].data.indexOf(Buffer.from('mvhd'))+17
        const timescale =  files[key].data.readUInt32BE(start )
        const _duration = files[key].data.readUInt32BE(start +4,4)
        const duration = Math.floor((_duration/timescale)*1000)/1000

     
        return res.json({ status: 'success', path:filepath,duration })

    })

    return res.json({ status: 'success', path:"" })
})



//get 

module.exports = {upload}