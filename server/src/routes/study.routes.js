const express = require("express");

const {
  createStudy,
  getStudies,
  updateStudy,
} = require("../controllers/study.controller");

const router = express.Router();

router.post("/", createStudy);
router.get("/", getStudies);
router.patch("/:studyId", updateStudy);

module.exports = router;