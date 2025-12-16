const validator = require("validator");
const OtpModel = require("../models/Otp");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");

/* Generate 6 digit OTP */
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/* =========================
   SEND OTP
========================= */
exports.sendOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Provide email or phone",
      });
    }

    let identifier;

    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email address",
        });
      }
      identifier = email.toLowerCase();
    } else {
      if (!/^\+?\d{7,15}$/.test(phone)) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone number",
        });
      }
      identifier = phone;
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // Delete old OTPs
    await OtpModel.deleteMany({ identifier });

    // Save OTP
    await OtpModel.create({
      identifier,
      otp,
      expiresAt,
      attempts: 0,
    });

    // Create / Update user
    await User.findOneAndUpdate(
      { $or: [{ email: identifier }, { phone: identifier }] },
      email ? { email: identifier } : { phone: identifier },
      { upsert: true, new: true }
    );

    // Send Email
    if (email) {
      const mailResult = await sendMail(
        email,
        "Your Productr Login OTP",
        `Your OTP is ${otp}. It is valid for 5 minutes.`
      );

      if (!mailResult.success) {
        return res.status(500).json({
          success: false,
          message: "Email sending failed",
        });
      }
    } else {
      console.log(`📱 SMS OTP to ${phone}: ${otp}`);
    }

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================
   VERIFY OTP
========================= */
exports.verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        message: "Identifier and OTP required",
      });
    }

    const record = await OtpModel.findOne({ identifier }).sort({
      createdAt: -1,
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "No OTP request found",
      });
    }

    if (new Date() > new Date(record.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (record.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many wrong attempts",
      });
    }

    if (record.otp !== otp) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    await OtpModel.deleteMany({ identifier });

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    return res.json({
      success: true,
      message: "OTP verified successfully",
      user,
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
