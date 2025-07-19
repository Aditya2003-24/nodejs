import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
   
  },
  price: {
    type: Number,
    trim: true, 
    
  },
  originalPrice:{
    type: String,
    trim: true,
  },
  quantity:{
    type: String,
    trim: true,
  },
  image:{
    type: String,
    trim: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,

  },
  
});

export default mongoose.model("product", productSchema);
