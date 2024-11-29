const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
console.log('Connecting to MongoDB...');
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));

// Set up pollution routes (assuming you have a separate route handling pollution-related data)
const pollutionRoutes = require('./routes/pollution');
app.use('/api/pollution', pollutionRoutes);

// Route to fetch all feedback messages
app.get('/api/pollution/feedbacks', async (req, res) => {
  try {
    // Fetch feedback messages from the Pollution model
    const feedbacks = await mongoose.model('Pollution').find({ feedbackMessage: { $exists: true, $ne: null } }).select('feedbackMessage').sort({ timestamp: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Error fetching feedbacks' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
