import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      name:{
        type: String,
        trim: true,
      },
      price:{
        type: Number,
        trim: true
      },
      quantity:{
        type: Number,
        trim: true
      },
     
    }
  ],
  totalPrice: {
    type: Number,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["booked", "shipped", "delivered", "cancelled"],
    default: "booked"
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "UPI", "card"],
    default: "cash"
  },
  
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
