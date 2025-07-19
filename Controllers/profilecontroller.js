import profile from "../Models/profilemodel.js";

const createProfileController = async (req, res) => {
  try {
    const { name, email, number } = req.body;

    const imagePath = req.file?.path;

    if (!name || !email || !number ) {
      return res.status(400).json({
        success: false,
        message: "all filed are reqired",
      });
    }

    const newProfile = new profile({
      name,
      email,
      number,
      image: imagePath,
    });

    await newProfile.save();

    res.status(201).json({
      success: true,
      message: "Profile saved",
      data: newProfile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error saving profile",
      error: err.message,
    });
  }
};

export { createProfileController };



export const getUsers = async (req, res) => {
  // console.log("create working!!");
  try {
    const users = await profile.find();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ ONE
export const getUserById = async (req, res) => {
  try {
    const user = await profile.findById(req.params.id);
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
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, number } = req.body;
    let updatedData = { name, email, number };

    // Check if a file was uploaded
    if (req.file) {
      const imageUrl = req.file?.path;
      updatedData.image = imageUrl;
    }

    const updatedProfile = await profile.findByIdAndUpdate(id, updatedData, {
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
