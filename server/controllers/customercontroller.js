const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const Customer = require("../models/Customer");

const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // ✅ phone is optional now — only name, email, password required
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Name, email and password are required" });
    }

    const existingUser = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists with this email" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new Customer({
      name:     name.trim(),
      email:    email.toLowerCase().trim(),  // ✅ always store lowercase
      password: hash,
      phone:    phone || "",                 // ✅ optional
      role:     "customer",
    });

    await user.save();

    res.json({ success: true, message: "Customer registered successfully" });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Signup error: " + error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Email and password required" });
    }

    // ✅ lowercase trim to match how it was stored
    const user = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.json({ success: false, message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        phone: user.phone,
        role:  user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login error: " + error.message });
  }
};

module.exports = { signup, login };