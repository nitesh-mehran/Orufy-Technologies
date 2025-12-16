const nodemailer = require("nodemailer");

const FROM_EMAIL = process.env.FROM_EMAIL;
const EMAIL_PASS = process.env.EMAIL_PASS;

async function sendMail(to, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: FROM_EMAIL,
        pass: EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Productr" <${FROM_EMAIL}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent:", info.messageId);
    return { success: true };
  } catch (err) {
    console.error("❌ Email sending error:", err.message);
    return { success: false, error: err.message };
  }
}

module.exports = sendMail;
