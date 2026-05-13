const Percentage = require("../models/Percentage");

const getPercentages = async (req, res) => {
  const data = await Percentage.find().sort({ createdAt: -1 });
  res.json(data);
};

const addPercentage = async (req, res) => {
  const { value } = req.body;

  if (!value) {
    return res.status(400).json({ message: "Value required" });
  }

  const newData = new Percentage({ value });
  await newData.save();

  res.json(newData);
};

const deletePercentage = async (req, res) => {
  const { id } = req.params;

  await Percentage.findByIdAndDelete(id);

  res.json({ message: "Deleted successfully" });
};

module.exports = {
  getPercentages,
  addPercentage,
  deletePercentage,
};
