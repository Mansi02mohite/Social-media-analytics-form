const mongoose = require('mongoose');

const pollutionSchema = new mongoose.Schema({
  location: { type: String, required: true },
  pollutionExperience: { type: String, required: true },
  symptoms: [String],
  duration: { type: String },
  pollutionSource: { type: String },
  timestamp: { type: Date, default: Date.now },
  feedbackMessage: { type: String, required: false },  // Feedback message
  feedbackRating: { type: Number, min: 1, max: 5, required: false },  // Feedback rating (1-5)
});

const Pollution = mongoose.model("Pollution", pollutionSchema);

module.exports = Pollution;
