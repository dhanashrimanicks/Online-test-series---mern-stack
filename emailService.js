const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
// require("dotenv").config();
dotenv.config({ path: "./config.env" });

// Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // ✅ Hostinger's SMTP server
  port: 465, // ✅ Or 587 if TLS
  secure: true, // ✅ true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER, // Your full email address e.g., "you@yourdomain.com"
    pass: process.env.EMAIL_PASS, // Your email password (or app password)
  },
});

// const dumEmail = "umidphp.akshay@gmail.com";
// Styled registration email
const generateRegistrationHTML = (name, email, password) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
    <h2 style="color: #2c3e50;">Welcome to <span style="color: #3498db;">Online Test Series</span></h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>You have been successfully registered as a faculty member.</p>
    <div style="background-color: #f4f6f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <h4 style="margin-bottom: 10px; color: #34495e;">Login Credentials:</h4>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
    </div>
    <p style="color: #7f8c8d;">Please make sure to change your password after logging in.</p>
    <br />
    <p style="font-size: 14px; color: #bdc3c7;">This is an automated message. Please do not reply to this email.</p>
  </div>
`;

const sendRegistrationEmail = async (to, name, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "🎓 Faculty Registration - Online Test Series",
    html: generateRegistrationHTML(name, to, password),
  };

  await transporter.sendMail(mailOptions);
};

const sendResetPasswordEmail = async (to, name, link) => {
  const mailOptions = {
    from: `"Test Series Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Your Password",
    html: `
      <div style="font-family:Arial; max-width:600px; margin:auto; padding:20px; background:#f9f9f9; border-radius:10px;">
        <h2 style="color:#333;">Hello, ${name}</h2>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <a href="${link}" style="display:inline-block; background:#007bff; color:#fff; padding:12px 20px; text-decoration:none; border-radius:5px; margin:10px 0;">Reset Password</a>
        <p>If you didn’t request this, you can ignore this email.</p>
        <p style="color:#888;">This link is valid for 15 minutes.</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendRegistrationEmail,
  sendResetPasswordEmail,
};
