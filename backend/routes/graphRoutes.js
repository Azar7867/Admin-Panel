const express = require("express");

const {
  getGraphData,
  createGraphData,
} = require("../controllers/graphController");

const router = express.Router();

router.get("/", getGraphData);

router.post("/", createGraphData);

module.exports = router;