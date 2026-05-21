const express = require("express");

const {
  exportStudyData,
} = require("../controllers/export.controller");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/studies/:studyId/export", authMiddleware, exportStudyData);

module.exports = router;