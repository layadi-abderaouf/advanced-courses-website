const express = require('express');
var path = require('path');
const fileUpload = require("express-fileupload");
const fs = require("fs")
const fsPromises = require('fs/promises')
const dotenv = require('dotenv')
var cors = require('cors')
const bodyParser = require('body-parser');

//db
const DBconnect = require('./config/db');
//middleware
const { notFound, errorHendler } = require('./middleware/error-handler');
const { user_required } = require('./middleware/authorization');

//import routes
const userRoutes = require('./routes/userRoutes')
const courseRoute = require('./routes/courseRoutes')
const contentRoute = require('./routes/courseContentRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const chatRoutes = require('./routes/chatRoutes')
const {upload} = require('./controllers/uploadController');
const { webhook } = require('./controllers/paymentController');



dotenv.config()

//connect to database
DBconnect();

const app = express();
app.use(cors()) 

//payment webhook
app.post('/webhook', bodyParser.raw({type: 'application/json'}),webhook)
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')));


  


//use routes
app.use('/api/user',userRoutes);
app.use('/api/course',courseRoute);
app.use('/api/course/content',contentRoute);
app.use('/api/payment',paymentRoutes);
app.use('/api/chat',chatRoutes);


//upload
const filesPayloadExists = require('./middleware/filesPeylodExist');
const fileExtLimiter = require('./middleware/filextLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');



app.use('/api/upload',user_required,
fileUpload({ createParentPath: true }),
filesPayloadExists,
fileExtLimiter(['.png', '.jpg', '.jpeg','.mp4']),
fileSizeLimiter,
upload)


const Enrollement = require('./models/course_content/Enrollement');


app.get('/video/:name', async(req, res) => {
   try {
    const name = req.params.name
    const {user_id,course_id} = req.query
    const _path = path.join('private/', 'video/' + name)
    if(!user_id || !course_id || req.headers.referer !== process.env.REFERER_URL){
        return res.status(404).json('your not authorized')
    }
    const is_enroll = await Enrollement.find({user:user_id,course:course_id})
  
    if( is_enroll[0]?.course == course_id){
        if(fs.existsSync(_path)){
            let rangeHeader = req.headers.range
           
            if(!rangeHeader) rangeHeader = 'bytes=0-'
            // check req header if it contains a rage attr
            ///if (!rangeHeader) throw new Error('Requires Range header')
        
            // get file stat with fs module to access size
           
            const fileData = await fsPromises.stat(_path)
            const videoSize = fileData.size
        
            // identify the size of the chunks that the server is setnding
            const chunkSize = 10 ** 6
            // get the starting byte from req header's range
            const start = Number(rangeHeader.replace(/\D/g, ""))
            // decide the end byte considering chonk size
            const end = Math.min(start + chunkSize, videoSize - 1)
            const contentLength = end - start + 1
            const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": contentLength,
                "Content-Type": "video/mp4",
            }
            const file_stream = fs.createReadStream(_path, { start, end })
            res.writeHead(206, headers)
            file_stream.pipe(res)
        }else{
            return res.status(403).json('not auth')
        }
    }else{
        return  res.status(403).json('not auth 2')
    }
   
   } catch (error) {
    return res.status(500).json('error')
   }
    
    
    
    
});




//error handler
app.use(notFound)
app.use(errorHendler)


app.listen(process.env.PORT || 5000, () => {
    console.log('Server listening on port 3000');
});
  