const express = require("express");
const Schedule = require("../models/Schedule");

const router = express.Router();

router.post("/", async (req, res) => {
  const newSchedule = new Schedule(req.body);
  await newSchedule.save();
  res.json(newSchedule);
});

router.get("/", async (req, res) => {
  const data = await Schedule.find();
  res.json(data);
});
router.put("/:id", async (req, res) => {
  const updated = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
  });
  res.json(updated);
});
router.delete("/:id", async (req, res) => {
  await Schedule.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;
