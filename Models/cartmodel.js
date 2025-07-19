import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    
 
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        
      },
      name: {
        type: String,
       
      },
      image: {
        type: String,
      },
      price: {
        type: Number,
      
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
      totalPrice: {
        type: Number,
      }
    }
  ],
  cartTotal: {
    type: Number,
    default: 0,
  },
 
});

export default mongoose.model("cart", cartSchema);
