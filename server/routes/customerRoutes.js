const express   = require("express");
const router    = express.Router();
const Customer  = require("../models/Customer");
const { authMiddleware } = require("../middleware/authMiddleware");

// ✅ Get current logged-in customer profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select("-password");
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// ✅ Update customer profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updated = await Customer.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true }
    ).select("-password");
    res.json({ success: true, customer: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// ✅ Get all customers (admin use)
router.get("/all", async (req, res) => {
  try {
    const customers = await Customer.find().select("-password");
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ message: "Error fetching customers" });
  }
});

module.exports = router;