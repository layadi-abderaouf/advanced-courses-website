const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema(
    {
        name :{type :String,required:true},
        phone:{type:Number,requireed:false},
        email:{type :String,required:true,unique:true},
        password:{type :String,required:true,min:5},
        country:{type:String,require:false},
        is_teacher:{type:Boolean,default:false},
        teacher_id:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"Teacher"
        }
        
    },
    {
        timestamps : true
    }
)



UserSchema.pre('save',async function(next){
    if(!this.isModified){
        next();
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

const User = mongoose.model('User',UserSchema);

module.exports = User;