import mongoose, { Schema, model } from "mongoose";
import bc from 'bcryptjs'

const userSchema = new Schema({
    userName:{
        type:String,
        unique:true,
        required:[true , 'userNmae is required'],
        min:[3, 'minimum length 3 char'],
        max:[20, 'max length 20 char']
    },
    email:{
        type:String,
        required:[true, 'email is required'],
        unique:[true,'email must be unique']
    },
    password:{
        type:String,
        required:[true, 'password is required'],
    },
    phone:{
        type:String,
    },
    role:{
        type:String,
        default:"User",
        enum:['User','Shop' ,'Admin']
    },
    storeName:{
        type:String,
        unique:true,
    },
    city:{
        type:String
    },
    address:{
        type:String
    },
    commercialRegister:{
        type:String
    },
    isConfirmed:{
        type:Boolean,
        default:false,
    },
    isLoggedIn:{
        type:Boolean,
        default:false,
    },
    image:{
        path:{
            type:String,
        },
        public_id:{
            type:String,
        },
    },
    forgetCode:String,
    changePassword:Number,
},{
    timestamps:true
})

userSchema.pre('save',function(next , doc){
    this.password = bc.hashSync(this.password, +process.env.SALT_ROUNDS)
    next()
})


const userModel = mongoose.models.User||model('User',userSchema)
export default userModel