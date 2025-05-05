import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER, // Your Elastic Email account
    pass: process.env.SMTP_PASS, // Your SMTP password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    // IMPORTANT: The "from" address MUST be your verified email
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER, // Must be your verified email
      to,
      subject,
      html,
    });
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
