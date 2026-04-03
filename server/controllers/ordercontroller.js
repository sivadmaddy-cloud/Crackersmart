const Order    = require("../models/order");
const Customer = require("../models/Customer");

// ✅ PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const { items, amount, sessionId } = req.body;   //----

    if (!items || !amount || !sessionId) {
      return res.status(400).json({ error: "items and amount are required" });   ///-----
    }

    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const newOrder = new Order({
      userId: customer._id,
      name:   customer.name,
      email:  customer.email,
      items,
      amount,
      sessionId, // 🔥 SAVE THIS
    });

    await newOrder.save();
    res.json({ success: true, message: "Order placed successfully", order: newOrder });

  } catch (err) {
    console.error("PLACE ORDER ERROR:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
};

// ✅ GET MY ORDERS — customer sees only their orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders }); // ✅ always return { success, orders }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL ORDERS — admin only
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders }); // ✅ always return { success, orders }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};