const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");

router.get("/", ordersController.getAllOrders);
router.post("/", ordersController.createOrders);
router.put("/:id", ordersController.updateOrders);
router.delete("/:id", ordersController.deleteOrders);

module.exports = router;
