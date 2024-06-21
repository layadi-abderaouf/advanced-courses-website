const mongoose = require('mongoose')


const CategorySchema = mongoose.Schema(
    {
        name :{type :String,required:true,unique:true},
        parent:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        for:{type:String,default:'all'}    
    },
    {
        timestamps : true
    }
)

const Category = mongoose.model('Category',CategorySchema);

module.exports = Category;