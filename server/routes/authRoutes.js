// const express = require("express");
// const router = express.Router();
// const { signup, login } = require("../controllers/customercontroller");

// // Authentication endpoints
// router.post("/signup", signup);
// router.post("/login", login);

// module.exports = router; 


const express = require("express");
const router  = express.Router();
const { signup, login } = require("../controllers/customercontroller");
const twilio  = require("twilio");

// ─── Twilio client ────────────────────────────────────
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// ─── Email login / signup ─────────────────────────────
router.post("/signup", signup);
router.post("/login",  login);

// ─── Send OTP ─────────────────────────────────────────
// POST /auth/send-otp   body: { phone: "+919876543210" }
router.post("/send-otp", async (req, res) => {
  try {
    let { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: "Phone number required" });
    }

    // ✅ Auto-add +91 if user types without country code
    if (!phone.startsWith("+")) {
      phone = "+91" + phone;
    }

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({ to: phone, channel: "sms" });

    res.json({ success: true, message: "OTP sent successfully" });

  } catch (err) {
    console.error("Send OTP error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send OTP: " + err.message });
  }
});

// ─── Verify OTP ───────────────────────────────────────
// POST /auth/verify-otp   body: { phone: "+919876543210", otp: "123456" }
router.post("/verify-otp", async (req, res) => {
  try {
    let { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: "Phone and OTP required" });
    }

    if (!phone.startsWith("+")) {
      phone = "+91" + phone;
    }

    // ✅ Check OTP with Twilio Verify
    const result = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: phone, code: otp });

    if (result.status !== "approved") {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // ✅ Find or auto-create customer with this phone
    const Customer = require("../models/Customer");
    const jwt      = require("jsonwebtoken");

    let customer = await Customer.findOne({ phone });

    if (!customer) {
      // New user — create account automatically
      customer = new Customer({
        name:     "Customer",          // default name, they can update profile later
        email:    phone + "@otp.com",  // placeholder email to satisfy unique constraint
        password: "otp-login",         // not used for OTP users
        phone,
        role:     "customer",
      });
      await customer.save();
    }

    const token = require("jsonwebtoken").sign(
      { id: customer._id, role: customer.role, email: customer.email, name: customer.name },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        _id:   customer._id,
        name:  customer.name,
        email: customer.email,
        phone: customer.phone,
        role:  customer.role,
      },
    });

  } catch (err) {
    console.error("Verify OTP error:", err.message);
    res.status(500).json({ success: false, message: "OTP verification failed: " + err.message });
  }
});

module.exports = router;