import nodemailer from "nodemailer";
import { Router } from "express";

const router = Router();

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Define the route for handling OpenAI requests
router.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await transporter.sendMail({
      from: email, // The email address captured from the frontend
      to: process.env.EMAIL_USER, // Use the email address specified in .env
      subject: "Coverly Inquiry",
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    });

    res.status(200).json({ success: "Message sent successfully, Thank you!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
