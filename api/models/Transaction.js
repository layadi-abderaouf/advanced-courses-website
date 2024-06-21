const mongoose = require('mongoose')


const TransactionSchema = mongoose.Schema(
    {
       
        user_id:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        value:Number,
        type:String,
        status:String,
        line_items:[]
        
    },
    {
        timestamps : true
    }
)





const Transaction = mongoose.model('Transaction',TransactionSchema);

module.exports = Transaction;