import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
    },
    email:{
        type:String,
        trim:true,
    },
    image:{
        type:String
    },
    number:{
        type:String,
        trim:true,

    }
})

export default mongoose.model("profile", profileSchema);