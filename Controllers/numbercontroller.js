import number from "../Models/number.js"
import bcrypt from "bcryptjs";
import profile from "../Models/profilemodel.js";


const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();
const numcontroller = async (req,res) => {


    try {
      const { phone } = req.body;

    
      if (!phone) {
        return res.status(404).json({
          success: false,
          message: "Phone number is required",
        });
      }

      const otp = generateOTP();
      console.log(`Generated OTP for ${phone}: ${otp}`);
      const hashedOtp = await bcrypt.hash(otp, 10);

      const updateNumber = await number.findOne({ phone });

      if (updateNumber) {

        updateNumber.otp = hashedOtp;
        await updateNumber.save();

        res.status(200).json({
          success: true,
          message: "OTP updated successfully",
          data: updateNumber,
        });
      } 

      else{

      
      const userNumber = await number.create({ phone, hashedOtp });

      res.status(201).json({
        success: true,
        message: "Phone and OTP saved successfully",
        data: userNumber,
      });

    }
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }

}

//GET phonenumber and OTP

export const getNumber = async (req, res) => {
    // console.log("create working!!");
  try {
    const users = await number.find();
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET BY ID

export const getNumbertById = async (req, res) => {
  try {
    const user = await number.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE NUMBER BY ID


export const updateNumber = async (req, res) => {
  try {
    const { id } = req.query;
    const { phone, otp } = req.body;
    let updatedData = { phone,otp };

    const updatedProfile = await number.findByIdAndUpdate(id, updatedData, {
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
      message: err.message,
    });
  }
};


// DELETE BY ID

export const deleteNumber = async (req, res) => {
  try {
    const delet = await number.findByIdAndDelete(req.query.id);
    if (!delet)
      return res.status(404).json({ success: false, message: "product not found" });
    res.json({ success: true, message: "product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};









//Verify otp

const verifyOtpController = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({
      success: false,
      message: "Phone and OTP are required",
    });
  }

  try {
    const user = await number.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Phone number not found",
      });
    }




    const OtpValid = await bcrypt.compare(otp, user.otp);

    if (!OtpValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });



  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export {numcontroller,verifyOtpController} ;



// CREATE USER PROFILE
const createProfileController = async (req, res) => {
  try {
    const { name, email, phonenumber } = req.body;

    const imagePath = req.file?.path;

    if (!name || !email || !phonenumber ) {
      return res.status(400).json({
        success: false,
        message: "all filed are reqired",
      });
    }

    const newProfile = new profile({
      name,
      email,
      phonenumber,
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
      error: "Error saving profile",
      message: err.message,
    });
  }
};

export { createProfileController };



export const getUsers = async (req, res) => {
  // console.log("create working!!");
  try {
    const users = await profile.find();
    res.status(200).json({ success: true, users });
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
    const { name, email, phonenumber } = req.body;
    let updatedData = { name, email, phonenumber };

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
      message: err.message,
    });
  }
};
