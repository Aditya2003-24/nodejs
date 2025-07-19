import number from "../Models/number.js";
import bcrypt from "bcryptjs";

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

export default verifyOtpController;
