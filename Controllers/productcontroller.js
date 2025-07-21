import product from "../Models/productmodel.js"

const productController = async (req,res) => {


try {
    const { name, price, originalPrice, quantity, category } = req.body;
    const image = req.file?.path;

    if (!name || !price || !originalPrice || !quantity || !category || !image) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, price, originalPrice, quantity, category, image",
      });
    }

    const produ = await product.create({
      name,
      price,
      originalPrice,
      quantity,
      category,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: produ,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }


};

export const getProduct = async (req, res) => {
    // console.log("create working!!");
  try {
    const users = await product.find();
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ ONE
export const getProductById = async (req, res) => {
  try {
    const user = await product.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, price, originalPrice, quantity, category } = req.body;
    let updatedData = { name, price, originalPrice, quantity, category };

    // Check if a file was uploaded
    if (req.file) {
      const imageUrl = req.file?.path;
      updatedData.image = imageUrl;
    }

    const updatedProfile = await product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: updatedProfile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: err.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const delet = await product.findByIdAndDelete(req.query.id);
    if (!delet)
      return res.status(404).json({ success: false, message: "product not found" });
    res.json({ success: true, message: "product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export  { productController,deleteProduct };
