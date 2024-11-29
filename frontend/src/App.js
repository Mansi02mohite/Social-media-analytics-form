import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const [location, setLocation] = useState("");
  const [pollutionExperience, setPollutionExperience] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [duration, setDuration] = useState("");
  const [pollutionSource, setPollutionSource] = useState("");
  const [aggregateData, setAggregateData] = useState([]);
  const [tweets, setTweets] = useState([]); // State to store tweets

  // City options for the dropdown
  const cityOptions = [
    "Delhi",
    "Ghaziabad",
    "Faridabad",
    "Gurgaon",
    "Noida",
    "Greater Noida",
    "YEIDA",
  ];

  // Fetch aggregate data from the backend
  const fetchAggregateData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/pollution/aggregate");
      const data = await response.json();
      setAggregateData(data);
    } catch (error) {
      console.error("Error fetching aggregate data:", error);
    }
  };

  // Fetch tweets for a specific city from the backend
  const fetchTweets = async (city) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tweets/${city}`);
      const data = await response.json();
      setTweets(data); // Set the tweets data
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  useEffect(() => {
    fetchAggregateData();
  }, []);

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setLocation(selectedCity);
    fetchTweets(selectedCity); // Fetch tweets whenever the city is changed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      location,
      pollutionExperience,
      symptoms,
      duration,
      pollutionSource,
    };

    try {
      const response = await fetch("http://localhost:5000/api/pollution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Pollution report saved!");
        setLocation("");
        setPollutionExperience("");
        setSymptoms([]);
        setDuration("");
        setPollutionSource("");
        fetchAggregateData(); // Refresh aggregate data after submission
      } else {
        alert("Error submitting report!");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pollution Report</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <label>Location:</label>
        <select value={location} onChange={handleCityChange} required>
          <option value="">Select a City</option>
          {cityOptions.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
        <br />
        <label>Pollution Experience:</label>
        <select
          value={pollutionExperience}
          onChange={(e) => setPollutionExperience(e.target.value)}
          required
        >
          <option value="">Select</option>
          <option value="Good">Good</option>
          <option value="Moderate">Moderate</option>
          <option value="Poor">Poor</option>
          <option value="Very Poor">Very Poor</option>
          <option value="Severe">Severe</option>
        </select>
        <br />
        <label>Symptoms:</label>
        <div>
          {[
            "Breathing Difficulty",
            "Eye Irritation",
            "Coughing",
            "Fatigue",
            "No Symptoms",
          ].map((symptom) => (
            <label key={symptom}>
              <input
                type="checkbox"
                value={symptom}
                onChange={(e) =>
                  setSymptoms((prev) =>
                    e.target.checked
                      ? [...prev, e.target.value]
                      : prev.filter((s) => s !== e.target.value)
                  )
                }
              />
              {symptom}
            </label>
          ))}
        </div>
        <br />
        <label>Duration of Exposure:</label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        >
          <option value="">Select</option>
          <option value="< 1 Hour">{"< 1 Hour"}</option>
          <option value="1-3 Hours">1-3 Hours</option>
          <option value="> 3 Hours">{"> 3 Hours"}</option>
        </select>
        <br />
        <label>Perceived Pollution Source:</label>
        <div>
          {[
            "Vehicles",
            "Construction Dust",
            "Industrial Emissions",
            "Burning Waste",
            "Not Sure",
          ].map((source) => (
            <label key={source}>
              <input
                type="radio"
                name="pollutionSource"
                value={source}
                checked={pollutionSource === source}
                onChange={(e) => setPollutionSource(e.target.value)}
              />
              {source}
            </label>
          ))}
        </div>
        <br />
        <button type="submit">Submit Report</button>
      </form>

      <h2>Pollution Report by Location</h2>
      <Bar
        data={{
          labels: aggregateData.map((item) => item._id),
          datasets: [
            {
              label: "Pollution Reports",
              data: aggregateData.map((item) => item.count),
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "Average Pollution Experience",
              data: aggregateData.map((item) => item.avgPollutionExperience),
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true },
            title: { display: true, text: "Reports by Location" },
          },
        }}
      />

      <h2>Recent Tweets on Pollution</h2>
      {tweets.length > 0 ? (
        <ul>
          {tweets.map((tweet, index) => (
            <li key={index}>
              <strong>{tweet.author_id}</strong>: {tweet.text} <br />
              <small>{new Date(tweet.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tweets found for this city.</p>
      )}
    </div>
  );
};

export default App;
