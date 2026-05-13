const express = require("express");

const {
  createLead,
  getAllLeads,
  getSingleLead,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");

const router = express.Router();

router.post("/create", createLead);

router.get("/all", getAllLeads);

router.get("/:id", getSingleLead);

router.put("/update/:id", updateLead);

router.delete("/delete/:id", deleteLead);

module.exports = router;
