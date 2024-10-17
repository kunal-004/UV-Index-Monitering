const express = require("express");
const router = express.Router();
const UvData = require("../models/uv.models");

router.post("/UvData", async (req, res) => {
  try {
    const { uvIndex } = req.body;
    const uvData = new UvData({ uvIndex });
    await uvData.save();

    res.status(201).json({ message: "UV data saved", uvData });
  } catch (error) {
    res.status(500).json({ message: "Error saving UV data", error });
  }
});

router.get("/UvData/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const uvData = await UvData.find({ createdAt: { $gte: today } });

    const formattedUvData = uvData.map((data) => ({
      uvIndex: data.uvIndex,
      createdAt: data.createdAt,
    }));

    res.status(200).json(formattedUvData);
  } catch (error) {
    console.error("Error fetching UV data:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/UvData/weekly", async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const uvData = await UvData.find({
      createdAt: { $gte: sevenDaysAgo },
    });

    const formattedUvData = uvData.map((data) => ({
      uvIndex: data.uvIndex,
      createdAt: data.createdAt,
    }));

    res.status(200).json(formattedUvData); 
  } catch (error) {
    console.error("Error fetching UV data:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/UvData/latest", async (req, res) => {
  try {
    const latestData = await UvData.findOne().sort({ createdAt: -1 });
    if (latestData) {
      res.status(200).json(latestData);
    } else {
      res.status(404).json({ message: "No UV data found" });
    }
  } catch (error) {
    console.error("Error fetching latest UV data:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
