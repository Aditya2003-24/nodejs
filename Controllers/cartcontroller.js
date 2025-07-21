import cart from "../Models/cartmodel.js";
import product from "../Models/productmodel.js";

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

   
    const foundProduct = await product.findById(productId);
    if (!foundProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const productTotalPrice = foundProduct.price * quantity;

   
    let userCart = await cart.findOne({ userId });

    if (!userCart) {
     
      userCart = new cart({
        userId,
        products: [
          {
            productId,
            name: foundProduct.name,
            image: foundProduct.image,
            price: foundProduct.price,
            quantity,
            totalPrice: productTotalPrice,
          },
        ],
        cartTotal: productTotalPrice,
      });

    } else {
      
      const existingProductIndex = userCart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingProductIndex > -1) {
      
        userCart.products[existingProductIndex].quantity += quantity;
        userCart.products[existingProductIndex].totalPrice =
          userCart.products[existingProductIndex].price *
          userCart.products[existingProductIndex].quantity;
      // } else {
        
      //   userCart.products.push({
      //     productId,
      //     name: foundProduct.name,
      //     image: foundProduct.image,
      //     price: foundProduct.price,
      //     quantity,
      //     totalPrice: productTotalPrice,
      //   });
      }

      
      userCart.cartTotal = userCart.products.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
      
    }
    

   
    await userCart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: userCart,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default addToCart;
