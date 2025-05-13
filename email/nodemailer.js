import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  } 
});

export const sendEmailAlert = async (toEmail, message) => {
  const mailOptions = {
    from: `"Mannir Umar Abubakar" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Account Alert",
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Alert email sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};
