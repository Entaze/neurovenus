const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  getOrganizationUsage,
} = require("../controllers/organization.controller");

router.get("/usage", auth, getOrganizationUsage);

module.exports = router;