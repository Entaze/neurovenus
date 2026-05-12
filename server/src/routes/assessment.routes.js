const express = require("express");

const {
  completeTask,
} = require("../controllers/assessment.controller");

const router = express.Router();

router.post("/complete", completeTask);

module.exports = router;