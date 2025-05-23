import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import merchantModel from "../models/merchantModel.js";
import { VERIFY_TEMPLATE } from "../config/emailTemplates.js";
import crypto from "crypto";
import dotenv from "dotenv";
import axios from 'axios';
dotenv.config();

export const checkLoginEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    // Check if the user exists in the database
    const user = await merchantModel.findOne({ email: email });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid email, Please register",
      });
    }

    return res.json({ success: true, message: "Account exists" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "password is required" });
  }

  try {
    const user = await merchantModel.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const authToken = jwt.sign(
      { id: user._id, ip: req.ip, userAgent: req.headers["user-agent"] },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      authToken: authToken,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//send verification OTP to user's email
export const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);

    if (!email) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const existingUser = await merchantModel.findOne({ email: email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "Email already exists, Please Login!",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const otpToken = jwt.sign({ email, hashedOtp }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const payload = {
      sender: {
        name: process.env.SENDER_NAME,
        email: process.env.SENDER_EMAIL,
      },
      to: [
        {
          email: email,
          name: email.split('@')[0],
        },
      ],
      subject: "Verification OTP",
      htmlContent: VERIFY_TEMPLATE.replace("{{otp}}", otp),
    };

    const headers = {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    };

    const response = await axios.post("https://api.brevo.com/v3/smtp/email", payload, { headers });

    if (response.status !== 201) {
      throw new Error("Failed to send OTP email");
    }

    console.log("OTP sent to the email");

    return res.json({
      success: true,
      message: "OTP sent to your email",
      otpToken: otpToken,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const verifyEmailOtp = async (req, res) => {
  const { email, otp, username, password } = req.body;

  // Check if required fields are provided
  if (!email || !otp) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Invalid request: Email, OTP required",
      });
  }

  // Retrieve the token from headers
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization token is missing" });
  }

  const otpToken = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"

  try {
    // Decode and verify the OTP token
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.email !== email) {
      return res
        .status(400)
        .json({ success: false, message: "Email mismatch" });
    }

    // Validate the OTP using bcrypt
    const isOtpValid = await bcrypt.compare(otp, decoded.hashedOtp);
    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new merchantModel({
      email: email,
      name: username,
      password: hashedPassword,
    });

    // Save the new user in the database
    await user.save();

    // Create a JWT token for the user
    const authToken = jwt.sign(
      { id: user._id, ip: req.ip, userAgent: req.headers["user-agent"] },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Email verified successfully");
    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
