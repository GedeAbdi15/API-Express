const express = require("express");
const router = express.Router();
const servicesController = require("../controllers/servicesController");

router.get("/", servicesController.getAllService);
router.post("/", servicesController.createService);
router.put("/:id", servicesController.updateService);
router.delete("/:id", servicesController.deleteService);

module.exports = router;
