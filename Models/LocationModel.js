import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    name: {
        type: String,
        trim:true,
       
    },
    latitude: {
        type: Number,
        trim:true,
       
    },
    longitude: {
        type: Number,
        trim:true,
        
    },
    
},{ timestamps: true });

export default mongoose.model("Location", LocationSchema);
