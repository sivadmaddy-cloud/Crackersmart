const router = require("express").Router();
const jwt    = require("jsonwebtoken");
const { loginAdmin } = require("../controllers/AdminController");

router.post("/login", async (req, res) => {
  try {
    console.log("📩 Admin login request:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const admin = await loginAdmin({ email, password });

    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin", email: admin.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    console.log("✅ Admin token created");

    res.json({ 
      success: true, 
      token, 
      admin: { _id: admin._id, email: admin.email } 
    });

  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;