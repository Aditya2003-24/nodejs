import number from "../Models/number.js"
import bcrypt from "bcryptjs";

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();
const numcontroller = async (req,res) => {


    try {
      const { phone } = req.body;

    
      if (!phone) {
        return res.status(400).json({
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


export default numcontroller;