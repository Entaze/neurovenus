const express = require("express");

const {
  completeTask,
} = require("../controllers/task.controller");

const router = express.Router();

router.post("/complete", completeTask);

module.exports = router;