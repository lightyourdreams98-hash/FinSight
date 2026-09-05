const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {

  const { name, email, password } = req.body;

  // 1. Validate input
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  // 2. Check whether email already exists
  const checkUserSql = `
    SELECT id
    FROM users
    WHERE email = ?
  `;

  db.query(checkUserSql, [email], async (err, results) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error"
      });
    }

    if (results.length > 0) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert user
    const insertUserSql = `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `;

    db.query(
      insertUserSql,
      [name, email, hashedPassword],
      (err, result) => {

        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Failed to create user"
          });
        }

        res.status(201).json({
          message: "User registered successfully",
          userId: result.insertId
        });
      }
    );

  });
});


router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  // 1. Check input
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  // 2. Find user by email
  const sql = `
    SELECT id, name, email, password
    FROM users
    WHERE email = ?
  `;

  db.query(sql, [email], async (err, results) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error"
      });
    }

    // 3. User doesn't exist
    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = results[0];

    // 4. Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // 5. Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    // 6. Send response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  });
});
module.exports = router;