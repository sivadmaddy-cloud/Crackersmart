const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // ✅ Fixed: was String
    ref: "Customer",
    required: true,
  },
  name:  { type: String, required: true },
  email: { type: String, required: true },
  items: [
    {
      name:  String,
      qty:   Number,
      price: Number,
      image: String,
    },
  ],
  amount: { type: Number, required: true },

// 🔥 ADD THIS (VERY IMPORTANT)
    sessionId: {
      type: String,
      unique: true,
    },


},
 { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);