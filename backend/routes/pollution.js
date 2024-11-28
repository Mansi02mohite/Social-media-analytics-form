const express = require("express");
const Pollution = require("../models/pollution");
const router = express.Router();

// Add a new pollution report
router.post("/", async (req, res) => {
  try {
    const report = new Pollution(req.body);
    await report.save();
    res.status(201).json({ message: "Pollution report saved successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to save report", error: err });
  }
});

// Fetch aggregated data
router.get("/aggregate", async (req, res) => {
  try {
    const aggregateData = await Pollution.aggregate([
      {
        $group: {
          _id: "$location",
          count: { $sum: 1 },
          avgPollutionExperience: {
            $avg: {
              $switch: {
                branches: [
                  { case: { $eq: ["$pollutionExperience", "Good"] }, then: 1 },
                  { case: { $eq: ["$pollutionExperience", "Moderate"] }, then: 2 },
                  { case: { $eq: ["$pollutionExperience", "Poor"] }, then: 3 },
                  { case: { $eq: ["$pollutionExperience", "Very Poor"] }, then: 4 },
                  { case: { $eq: ["$pollutionExperience", "Severe"] }, then: 5 },
                ],
                default: 0,
              },
            },
          },
        },
      },
      { $sort: { count: -1 } }, // Sort by number of reports
    ]);
    res.status(200).json(aggregateData);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch aggregate data", error: err });
  }
});

module.exports = router;
