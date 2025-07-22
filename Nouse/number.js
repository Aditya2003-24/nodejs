import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    
  },
  otp: {
    type: String,
    required: true,
  },
 
});

export default mongoose.model("number", otpSchema);
