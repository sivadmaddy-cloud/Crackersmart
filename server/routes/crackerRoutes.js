const express = require("express");
const router  = express.Router();

const crackerController = require("../controllers/CrackerController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// ✅ PUBLIC
router.get("/", crackerController.getCrackers);

// ✅ ADMIN ONLY
router.post("/add",       authMiddleware, isAdmin, crackerController.addCracker);
router.put("/:id",        authMiddleware, isAdmin, crackerController.updateCracker);   // ✅ was /update/:id
router.delete("/:id",     authMiddleware, isAdmin, crackerController.deleteCracker);   // ✅ was /delete/:id

module.exports = router;