const validator = require("validator");
const OtpModel = require("../models/Otp");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email && !phone)
      return res.status(400).json({ success: false, message: "Provide email or phone" });

    let identifier;
    if (email) {
      if (!validator.isEmail(email))
        return res.status(400).json({ success: false, message: "Invalid email" });
      identifier = email.toLowerCase();
    } else {
      if (!/^\+?\d{7,15}$/.test(phone))
        return res.status(400).json({ success: false, message: "Invalid phone" });
      identifier = phone;
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await OtpModel.deleteMany({ identifier });
    await OtpModel.create({ identifier, otp, expiresAt });

    await User.findOneAndUpdate(
      { $or: [{ email: identifier }, { phone: identifier }] },
      { $set: email ? { email: identifier } : { phone: identifier } },
      { upsert: true, new: true }
    );

    if (email) {
      await sendMail(email, "Your Productr OTP", `Your OTP is ${otp}. It expires in 5 minutes.`);
    } else {
      console.log(`SMS to ${phone}: Your OTP is ${otp}`);
    }

    return res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Verify OTP
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
      record.attempts = (record.attempts || 0) + 1;
      await record.save();
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    await OtpModel.deleteMany({ identifier });
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });

    return res.json({ success: true, message: "OTP verified", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
