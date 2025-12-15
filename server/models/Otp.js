const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  identifier: { type: String, required: true }, // email or phone
  otp: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Otp", otpSchema);
