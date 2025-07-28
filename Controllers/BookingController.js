import Order from "../Models/BookModel.js";
import cart from "../Models/cartmodel.js";


export const placeOrder = async (req, res) => {
  try {
    const { userId, address, paymentMethod } = req.body;

  
    if (!userId || !address || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

 
    const userCart = await cart.findOne({ userId });
    if (!userCart || userCart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }


    const totalPrice = userCart.products.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

   
    const order = new Order({
      userId,
      products: userCart.products,
      totalPrice,
      address,
      paymentMethod,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order._id,
    });

  } catch (error) {
    console.error("Place Order Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
