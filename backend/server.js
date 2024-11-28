const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { TwitterApi } = require('twitter-api-v2'); // Import Twitter API client
const pollutionRoutes = require('./routes/pollution');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));

// Twitter API client setup
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET_KEY,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Endpoint to fetch tweets related to pollution in a city
app.get('/api/tweets/:city', async (req, res) => {
  const city = req.params.city;
  try {
    const { data } = await twitterClient.v2.search(`air pollution ${city}`, {
      max_results: 5, // Fetch 5 tweets as an example
    });
    res.json(data); // Send tweets as a JSON response
  } catch (error) {
    console.error('Error fetching tweets:', error);
    res.status(500).send('Error fetching tweets');
  }
});

// Set up pollution routes
app.use('/api/pollution', pollutionRoutes);
    
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
