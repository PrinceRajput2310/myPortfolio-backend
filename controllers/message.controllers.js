import Message from "../models/message.js";
import nodemailer from "nodemailer";

export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    // Setup email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // your Gmail (auth user)
      to: process.env.TO_EMAIL, // your target email
      replyTo: email, // user email (from form)
      subject: "New Message from Portfolio Contact Form",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #007bff;">📩 New Contact Message</h2>
        
        <p style="font-size: 16px;">You have received a new message from your portfolio contact form.</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        
        <p style="font-size: 16px;"><strong>Message:</strong></p>
        <p style="font-size: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #007bff;">
          ${message}
        </p>
        
        <p style="font-size: 16px; margin-top: 30px;">Regards,</p>
        <p style="font-size: 15px;"><strong>${name}</strong><br/>${email}</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        
        <p style="font-size: 14px; color: #888;">This message was sent via your portfolio contact form.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Server error" });
  }
};
