const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp } = require("../controllers/authController");

// Send OTP
router.post("/send-otp", sendOtp);

// Verify OTP
router.post("/verify-otp", verifyOtp);

module.exports = router;
