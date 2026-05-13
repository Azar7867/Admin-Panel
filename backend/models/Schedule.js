const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  date: Date,
  meeting: String,
  time: String,
});

module.exports = mongoose.model("Schedule", scheduleSchema);
