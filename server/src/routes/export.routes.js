const express = require("express");

const {
  exportStudyData,
} = require("../controllers/export.controller");

const router = express.Router();

router.get("/studies/:studyId/export", exportStudyData);

module.exports = router;