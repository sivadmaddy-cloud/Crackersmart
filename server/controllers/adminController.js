const Admin = require("../models/Admin");

const loginAdmin = async ({ email, password }) => {
  try {
    console.log("📩 Login attempt:", email, password);

    const admin = await Admin.findOne({ email: email.trim() });

    console.log("📦 Found in DB:", JSON.stringify(admin));

    if (!admin) {
      console.log("❌ No admin found");
      return null;
    }

    console.log("🔑 DB pass:", `"${admin.password}"`);
    console.log("🔑 Input pass:", `"${password.trim()}"`);
    console.log("✅ Match:", admin.password.trim() === password.trim());

    if (admin.password.trim() !== password.trim()) {
      console.log("❌ Password mismatch");
      return null;
    }

    return admin;

  } catch (err) {
    console.error("❌ Admin Error:", err);
    return null;
  }
};

module.exports = { loginAdmin };
