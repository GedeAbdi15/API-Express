const express = require("express");
const router = express.Router();
const invoicesController = require("../controllers/invoicesController");

router.get("/", invoicesController.getAllInvoices);
router.post("/", invoicesController.createInvoices);
router.put("/:id", invoicesController.updateInvoices);
router.delete("/:id", invoicesController.deleteInvoices);

module.exports = router;
