import { generateToken } from "../Middlewares/jwtauthentication.js";
import User from "../Models/UserModel.js"
import bcrypt from "bcryptjs";

import http from 'http';


const otpLimits = {};
const OTP_LIMIT = 5;
const OTP_WINDOW = 60 * 60 * 1000; //1hr

const generateOtp = () => Math.floor(1000 + Math.random() * 9000);


const sendOtpSms = (mobile, otp) => {
  const currentTime = Date.now();

  if (!otpLimits[mobile]) {
    otpLimits[mobile] = { count: 0, firstSentTime: currentTime };
  }

  const { count, firstSentTime } = otpLimits[mobile];

  if (currentTime - firstSentTime < OTP_WINDOW) {
    if (count >= OTP_LIMIT) {
      return false; 
    }
  } else {
    otpLimits[mobile] = { count: 0, firstSentTime: currentTime };
  }


  const options = {
    method: 'POST',
    hostname: 'api.msg91.com',
    port: null,
    path: '/api/v5/flow/',
    headers: {
      authkey: '384292AwWekgBJSf635f77feP1',
      'content-type': 'application/json',
    },
  };

  const req = http.request(options, (res) => {
    const chunks = [];
    res.on('data', (chunk) => chunks.push(chunk));
    res.on('end', () => {
      const body = Buffer.concat(chunks);
      console.log('MSG91 Response:', body.toString());
    });
  });

  req.write(
    JSON.stringify({
      flow_id: '63614b3dabf10640e61fa856',
      sender: 'DSMONL',
      mobiles: `91${mobile}`,
      otp: otp,
    })
  );
  req.end();

  otpLimits[mobile].count++;
  return true;
};


export const sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: "Phone number is required" });
  }

  const otp = generateOtp().toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  let user = await User.findOne({ phone });

  if (!user) {
    user = new User({ phone, otp: hashedOtp });
  } else {
    user.otp = hashedOtp;
  }

 
  const smsSent = sendOtpSms(phone, otp);
  if (!smsSent) {
    return res.status(429).json({ success: false, message: "OTP limit reached. Try again later." });
  }

  await user.save();

  const token = generateToken(user._id);
  const userData = user.toObject();
  userData.token = token;

  console.log('Generated OTP:', otp);
  console.log('Hashed OTP:', hashedOtp);
  console.log('User ID:', user._id);
  console.log('JWT Token:', token);

  res.status(200).json({ success: true, message: "OTP sent successfully", token });
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

// export const adminLogin = async (req, res) => {
//   try{

//   const admin = "admin@gmail.com";
//   const passw = 1234
//   const {email , password} = req.body;

//   if(email === admin || password === passw){
//     res.status(200).json({ success: true, message: "Admin login done"});
//   }
//   else{
//     res.status(400).json({ success: false, message: "Email and password not correct"});
//   }
// } 
// catch (err){
//    res.status(500).json({ success: false, message: err.message });
// }

// }

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