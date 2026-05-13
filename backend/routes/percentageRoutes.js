const express = require("express");
const {
  getPercentages,
  addPercentage,
  deletePercentage,
} = require("../controllers/percentageController");

const router = express.Router();

router.get("/", getPercentages);
router.post("/", addPercentage);
router.delete("/:id", deletePercentage);

module.exports = router;
