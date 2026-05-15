const express = require("express");

const router = express.Router();

const {
  getLoginHours,
  checkIn,
  checkOut,
  clearRecords,
} = require("../controllers/loginController");

router.get("/", getLoginHours);

router.post("/checkin", checkIn);

router.put("/checkout", checkOut);

router.delete("/clear", clearRecords);

module.exports = router;