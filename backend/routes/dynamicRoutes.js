const express = require("express");
const Dynamic = require("../models/Dynamic");

const router = express.Router();

router.post("/create", async (req, res) => {
  const { collectionName } = req.body;

  let existing = await Dynamic.findOne({ collectionName });

  if (existing) return res.json(existing);

  const newCollection = new Dynamic({ collectionName });

  await newCollection.save();

  res.json(newCollection);
});

router.post("/:name/add-field", async (req, res) => {
  const { field } = req.body;

  const collection = await Dynamic.findOne({ collectionName: req.params.name });

  if (!collection) return res.status(404).json({ msg: "Not found" });

  if (!collection.fields.includes(field)) {
    collection.fields.push(field);
  }

  await collection.save();
  res.json(collection);
});

router.post("/:name/add-data", async (req, res) => {
  try {
    let collection = await Dynamic.findOne({
      collectionName: req.params.name,
    });

    if (!collection) {
      collection = new Dynamic({
        collectionName: req.params.name,
        fields: [],
        data: [],
      });
    }

    collection.data.push(req.body);

    await collection.save();

    res.json(collection);
  } catch (err) {
    console.error("Add data error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:name", async (req, res) => {
  try {
    let collection = await Dynamic.findOne({
      collectionName: req.params.name,
    });

    if (!collection) {
      collection = {
        fields: [],
        data: [],
      };
    }

    res.json(collection);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
router.put("/:name/update-data", async (req, res) => {
  const { index, updatedData } = req.body;

  const collection = await Dynamic.findOne({
    collectionName: req.params.name,
  });

  collection.data[index] = updatedData;

  await collection.save();

  res.json(collection);
});
router.delete("/:name/delete-data", async (req, res) => {
  const { index } = req.body;

  const collection = await Dynamic.findOne({
    collectionName: req.params.name,
  });

  collection.data.splice(index, 1);

  await collection.save();

  res.json(collection);
});
module.exports = router;
