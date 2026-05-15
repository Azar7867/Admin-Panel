const GraphData = require("../models/GraphData");

const getGraphData = async (req, res) => {
  try {
    const data = await GraphData.find();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createGraphData = async (req, res) => {
  try {
    const { month, sales, users, revenue } = req.body;

    const newData = new GraphData({
      month,
      sales,
      users,
      revenue,
    });

    const savedData = await newData.save();

    res.status(201).json(savedData);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getGraphData,
  createGraphData,
};