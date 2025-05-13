import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import pool from "../config/database.js";
import { sendEmailAlert } from "../email/nodemailer.js";

dotenv.config();
const secret_key = process.env.SECRET_KEY;

export const register = async (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !email || !password) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    const checkQuery = `SELECT * FROM auth WHERE phone = $1 OR email = $2`;
    const checkResult = await pool.query(checkQuery, [phone, email]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "Email or phone already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO auth (name, phone, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, phone, email
    `;
    const insertResult = await pool.query(insertQuery, [name, phone, email, hashedPassword]);

    return res.status(201).json({
      message: "Registration successful.",
      user: insertResult.rows[0],
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: "Phone and password are required." });
  }

  try {
    const userQuery = `SELECT * FROM auth WHERE phone = $1`;
    const userResult = await pool.query(userQuery, [phone]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = userResult.rows[0];

    if (user.is_blocked) {
      await sendEmailAlert(user.email);
      return res.status(403).json({ message: "Account locked due to too many failed attempts." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const attempts = user.failed_attempts + 1;

      await pool.query(
        `UPDATE auth SET failed_attempts = $1, last_failed_login = NOW() WHERE phone = $2`,
        [attempts, phone]
      );

      if (attempts >= 3) {
        await pool.query(
          `UPDATE auth SET is_blocked = TRUE, last_failed_login = NOW() WHERE phone = $1`,
          [phone]
        );
        await sendEmailAlert(user.email);
        return res.status(403).json({ message: "Too many failed attempts. Account locked." });
      }

      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Successful login: reset failed_attempts
    await pool.query(`UPDATE auth SET failed_attempts = 0 WHERE phone = $1`, [phone]);

    const token = JWT.sign({ id: user.id, phone: user.phone }, secret_key, { expiresIn: "15m" });
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    await pool.query(
      `INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)`,
      [user.id, token, expiresAt]
    );

    return res.status(200).json({ message: "Login successful", token });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const unblockUser = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required." });
  }

  try {
    const checkResult = await pool.query(`SELECT is_blocked FROM auth WHERE phone = $1`, [phone]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const { is_blocked } = checkResult.rows[0];

    if (!is_blocked) {
      return res.status(400).json({ message: "User is already unblocked." });
    }

    const updateResult = await pool.query(
      `UPDATE auth SET is_blocked = FALSE, failed_attempts = 0 WHERE phone = $1 RETURNING id, name, phone, email, is_blocked`,
      [phone]
    );

    return res.status(200).json({
      message: "User has been unblocked.",
      user: updateResult.rows[0],
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const reset_password = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide all required fields.",
    });
  }

  try {
    const checkUserResult = await pool.query(
      `SELECT * FROM auth WHERE email = $1`,
      [email]
    );

    if (checkUserResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateResult = await pool.query(
      `UPDATE auth SET password = $1 WHERE email = $2 RETURNING id, name, phone, email`,
      [hashedPassword, email]
    );

    return res.status(200).json({
      message: "Password updated successfully.",
      user: updateResult.rows[0],
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: err.message,
    });
  }
};
