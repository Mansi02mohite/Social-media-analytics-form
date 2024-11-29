const mongoose = require('mongoose');

const pollutionSchema = new mongoose.Schema({
  location: { type: String, required: true },
  pollutionExperience: { type: String, required: true },
  symptoms: [String],
  duration: { type: String },
  pollutionSource: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const Pollution = mongoose.model("Pollution", pollutionSchema);

module.exports = Pollution;
