

const fileSizeLimiter = (req, res, next) => {
    const files = req.files
    const {type} = req.query
    var MB = 5;
    if(type == "chat_img"||type == "question_img" ||type == "profile_img" || type == "course_img"){
         MB = 5; // 5 MB 
    }else if(type == "video"){
        MB = 500;
    }
  
    const FILE_SIZE_LIMIT = MB * 1024 * 1024;

    const filesOverLimit = []
    // Which files are over the limit?
    Object.keys(files).forEach(key => {
        if (files[key].size > FILE_SIZE_LIMIT) {
            filesOverLimit.push(files[key].name)
        }
    })

    if (filesOverLimit.length) {
        const properVerb = filesOverLimit.length > 1 ? 'are' : 'is';

        const sentence = `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB} MB.`.replaceAll(",", ", ");

        const message = filesOverLimit.length < 3
            ? sentence.replace(",", " and")
            : sentence.replace(/,(?=[^,]*$)/, " and");

        return res.status(413).json({ status: "error", message });

    }

    next()
}

module.exports = fileSizeLimiter