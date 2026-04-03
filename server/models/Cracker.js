const mongoose = require("mongoose");

const crackerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: String,
}, { timestamps: true });

module.exports = mongoose.model("Cracker", crackerSchema);