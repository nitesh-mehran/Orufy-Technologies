const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp } = require("../controllers/authController");

// Test route
router.get("/", (req, res) => {
  res.json({ success: true, message: "Auth API is working" });
});

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
