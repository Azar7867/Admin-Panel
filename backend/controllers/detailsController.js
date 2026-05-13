const Details = require("../models/Details");

const addDetails = async (req, res) => {
  try {
    const { name, product, place, discountPrice } = req.body;

    const newData = new Details({
      name,
      product,
      place,
      discountPrice,
    });

    await newData.save();

    res.json(newData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetails = async (req, res) => {
  try {
    const data = await Details.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDiscount = async (req, res) => {
  const { id } = req.params;
  const { originalPrice, percentage, discountPrice } = req.body;

  // console.log("Incoming data:", req.body);

  const updated = await Details.findByIdAndUpdate(
    id,
    {
      $set: {
        originalPrice,
        percentage,
        discountPrice,
      },
    },
    { new: true },
  );

  res.json(updated);
};
module.exports = {
  addDetails,
  getDetails,
  updateDiscount,
};
