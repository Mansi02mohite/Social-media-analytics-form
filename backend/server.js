const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { TwitterApi } = require('twitter-api-v2'); // Import Twitter API client
const pollutionRoutes = require('./routes/pollution'); // Assuming your pollution routes are here

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

// Twitter API client setup using Bearer Token
const twitterClient = new TwitterApi({
  bearer_token: process.env.TWITTER_BEARER_TOKEN,  // Use the Bearer Token from the .env file
});

// Endpoint to fetch tweets related to pollution in a city
app.get('/api/tweets/:city', async (req, res) => {
  const city = req.params.city;
  try {
    // Fetch tweets related to pollution in the city using the Bearer Token
    const { data } = await twitterClient.v2.search(`air pollution ${city}`, {
      max_results: 10, // Adjust max_results to be between 10 and 100
      'tweet.fields': 'created_at,author_id', // Get tweet details
    });
    
    const formattedTweets = data.map(tweet => ({
      text: tweet.text,
      created_at: tweet.created_at,
      author_id: tweet.author_id,
    }));
    
    res.json(formattedTweets); // Send the fetched tweets as a JSON response
  } catch (error) {
    console.error('Error fetching tweets:', error);
    res.status(500).send('Error fetching tweets');
  }
});

// Set up pollution routes (assuming you have a separate route handling pollution-related data)
app.use('/api/pollution', pollutionRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
