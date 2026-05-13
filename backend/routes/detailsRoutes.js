const express = require("express");
const {
  addDetails,
  getDetails,
  updateDiscount,
} = require("../controllers/detailsController");

const router = express.Router();

router.post("/", addDetails);
router.get("/", getDetails);
router.put("/:id", updateDiscount);

module.exports = router;
