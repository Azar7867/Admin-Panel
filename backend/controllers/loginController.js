const LoginHour = require("../models/LoginHour");


// GET ALL LOGIN HOURS
const getLoginHours = async (req, res) => {
  try {
    const data = await LoginHour.find().sort({
      createdAt: -1,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// CHECK IN
const checkIn = async (req, res) => {
  try {
    const login = await LoginHour.create({
      start: new Date(),
      status: "Active",
    });

    res.status(201).json(login);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// CHECK OUT
const checkOut = async (req, res) => {
  try {
    const activeSession = await LoginHour.findOne({
      status: "Active",
    });

    if (!activeSession) {
      return res.status(404).json({
        message: "No active session found",
      });
    }

    const endTime = new Date();

    const duration = Math.floor(
      (endTime - activeSession.start) / 1000
    );

    activeSession.end = endTime;
    activeSession.duration = duration;
    activeSession.status = "Clocked Out";

    await activeSession.save();

    res.json(activeSession);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE ALL
const clearRecords = async (req, res) => {
  try {
    await LoginHour.deleteMany();

    res.json({
      message: "All records deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getLoginHours,
  checkIn,
  checkOut,
  clearRecords,
};