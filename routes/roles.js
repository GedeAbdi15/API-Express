const express = require("express");
const router = express.Router();
const rolesController = require("../controllers/rolesController");

router.get("/", rolesController.getAllRoles);
router.post("/", rolesController.createRoles);
router.put("/:id", rolesController.updateRoles);
router.delete("/:id", rolesController.deleteRoles);

module.exports = router;
