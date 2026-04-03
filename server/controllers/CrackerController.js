const Cracker = require("../models/Cracker");  // ✅ Fixed: was commented out

exports.addCracker = async (req, res) => {
  try {
    const { name, image, price, stock } = req.body;

    if (!name || !price || !stock) {
      return res.status(400).json({ message: "name, price and stock are required" });
    }

    const cracker = new Cracker({
      name,
      image,
      price: Number(price),
      stock: Number(stock),
    });

    await cracker.save();
    res.json({ success: true, message: "Cracker added successfully", cracker });
  } catch (error) {
    console.error("ADD CRACKER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCrackers = async (req, res) => {
  try {
    const data = await Cracker.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch crackers" });
  }
};

exports.updateCracker = async (req, res) => {
  try {
    const updated = await Cracker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: "Updated", cracker: updated });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

exports.deleteCracker = async (req, res) => {
  try {
    await Cracker.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};