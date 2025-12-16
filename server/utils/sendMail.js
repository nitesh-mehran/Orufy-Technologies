const nodemailer = require("nodemailer");

const FROM_EMAIL = process.env.FROM_EMAIL;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: FROM_EMAIL,
    pass: EMAIL_PASS,
  },
});

async function sendMail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: `"Productr" <${FROM_EMAIL}>`,
      to,
      subject,
      text,
    });

    return { success: true };
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return { success: false, error: error.message };
  }
}

module.exports = sendMail;
