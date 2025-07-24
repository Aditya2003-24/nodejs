import User from "../Models/UserModel.js"
import bcrypt from "bcryptjs";


export const sendOtp = async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000).toString(); 
  const hashedOtp = await bcrypt.hash(otp, 10);
  console.log(hashedOtp)


  let user = await User.findOne({ phone });
  if(!phone) {
    res.status(404).json({success:true,message:"Number is required"})
  }

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

    user.name = name || user.name;
    user.email = email || user.email;
   const files = req.files; 

  if (files && files.length > 0) {
    user.image = user.image || []; 
    const imagePaths = files.map((file) => file.path);
    user.image.push(...imagePaths); 
  }

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

export const adminLogin = async (req, res) => {
  try{

  const admin = "admin@gmail.com";
  const passw = 1234
  const {email , password} = req.body;

  if(email === admin || password === passw){
    res.status(200).json({ success: true, message: "Admin login done"});
  }
  else{
    res.status(400).json({ success: false, message: "Email and password not correct"});
  }
} 
catch (err){
   res.status(500).json({ success: false, message: err.message });
}

}

export const getUser = async (req, res) => {
    
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};