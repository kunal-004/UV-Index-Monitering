const express = require("express");
const router = express.Router();
const UvData = require("../models/uv.models");

router.post("/UvData", async (req, res) => {
  try {
    const newUVData = new UvData({
      uvIndex: req.body.uvIndex,
    });
    await newUVData.save();
    res.status(201).json({ message: "UV data saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/UvData/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const uvData = await UvData.find({ createdAt: { $gte: today } });
    res.status(200).json(uvData);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;