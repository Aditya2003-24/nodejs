import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    
  },
  otp: {
    type: String, 
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  image: [ 
    {
    type: String,
    
  }
]

},{timestamps:true});

export default mongoose.model("User", userSchema);
