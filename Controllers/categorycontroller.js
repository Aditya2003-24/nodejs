import category from "../Models/categorymodel.js";

const categoryControll = async (req, res) => {
    
  try {
    const { name } = req.body;
    
   
    const imagePath = req.file?.key  || null;
    
    console.log(name)
    console.log(imagePath)
    
   
    if (!name || !imagePath) {
      return res.status(400).json({
        success: false,
        message: "Name and image are required.",
      });
    }
    
    
    const newCategory = new category({
      name,
      image:imagePath,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category saved successfully",
      data: newCategory,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default categoryControll;
