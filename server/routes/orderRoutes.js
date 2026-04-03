const express = require("express");
const router  = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");


const { placeOrder, getMyOrders, getAllOrders } = require("../controllers/ordercontroller");

router.post("/place-order",  authMiddleware,          placeOrder);   // customer places order
router.get("/my-orders",     authMiddleware,          getMyOrders);  // customer views own orders
router.get("/all-orders",    authMiddleware, isAdmin, getAllOrders);  // admin views all orders

module.exports = router;