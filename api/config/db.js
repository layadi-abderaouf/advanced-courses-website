const mongoose = require('mongoose');


const DBconnect = async ()=>{
    console.log(process.env.DB_URL);
    try {
        const connection = await mongoose.connect(
            process.env.DB_URL,
        );
        console.log('mongoDB conected : ' + connection.connection.host)
    } catch (error) {
        console.log('error , mongoDB is not connected ' + error.message);
        process.exit();
    }
}

module.exports = DBconnect;