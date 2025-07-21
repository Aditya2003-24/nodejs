import User from "../Models/UserModel.js"
import bcrypt from "bcryptjs";


export const sendOtp = async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000).toString(); 
  const hashedOtp = await bcrypt.hash(otp, 10);
  console.log(hashedOtp)


  let user = await User.findOne({ phone });

  if (!user) {
    user = new User({ phone, otp:hashedOtp }); 
  } else {
    user.otp = hashedOtp; 
  }

  await user.save();
  console.log(otp)

  

  res.status(200).json({ success: true, message: "OTP sent"});
};


export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  if (!user.otp) {
    return res.status(400).json({ success: false, message: "No OTP found or already verified" });
  }

  const isOtpValid = await bcrypt.compare(otp.toString(), user.otp);

  if (!isOtpValid) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  user.isVerified = true;
  user.otp = null;
  await user.save();

  res.status(200).json({ success: true, message: "User verified" });
};


// , userId: user._id


export const updateUserProfile = async (req, res) => {
  const { userId, name, email } = req.body;

  const user = await User.findById(userId);
  if (!user || !user.isVerified) {
    return res.status(400).json({ success: false, message: "User not verified" });
  }

  user.name = name;
  user.email = email;

  await user.save();

  res.status(200).json({ success: true, message: "Profile updated" });
};


export const loginWithPhone = async (req, res) => {
  const { phone } = req.body;

  const user = await User.findOne({ phone, isVerified: true });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found or not verified" });
  }


  res.status(200).json({ success: true, message: "Login successful" });
};
