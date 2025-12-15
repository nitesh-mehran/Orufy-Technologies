const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  profile: { type: String, trim: true, default: "" }, // Profile image optional
  name: { type: String, trim: true, default: "" }, // User ka name
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
