const validator = require("validator");
const OtpModel = require("../models/Otp");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendOtp = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body); // ✅ check incoming payload

    const { email, phone } = req.body;

    if (!email && !phone)
      return res.status(400).json({ success: false, message: "Provide email or phone" });

    let identifier = email ? email.toLowerCase() : phone;

    if (email && !validator.isEmail(email))
      return res.status(400).json({ success: false, message: "Invalid email" });

    if (phone && !/^\+?\d{7,15}$/.test(phone))
      return res.status(400).json({ success: false, message: "Invalid phone" });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OtpModel.deleteMany({ identifier });
    await OtpModel.create({ identifier, otp, expiresAt, attempts: 0 });

    await User.findOneAndUpdate(
      { $or: [{ email: identifier }, { phone: identifier }] },
      email ? { email: identifier } : { phone: identifier },
      { upsert: true, new: true }
    );

    if (email) {
      const mailResult = await sendMail(
        email,
        "Your Productr OTP",
        `Your OTP is ${otp}. It is valid for 5 minutes.`
      );

      console.log("Email result:", mailResult);
      if (!mailResult.success)
        return res.status(500).json({ success: false, message: "Email sending failed: " + mailResult.error });
    } else {
      console.log(`📱 SMS OTP to ${phone}: ${otp}`);
    }

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp)
      return res.status(400).json({ success: false, message: "Identifier and OTP required" });

    const record = await OtpModel.findOne({ identifier }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ success: false, message: "No OTP request found" });

    if (new Date() > new Date(record.expiresAt))
      return res.status(400).json({ success: false, message: "OTP expired" });

    if (record.attempts >= 5)
      return res.status(429).json({ success: false, message: "Too many attempts" });

    if (record.otp !== otp) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    await OtpModel.deleteMany({ identifier });

    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });

    return res.json({ success: true, message: "OTP verified successfully", user });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
