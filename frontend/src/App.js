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
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [comments, setComments] = useState([]); // State to store comments

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

  // Fetch feedback messages from the backend
  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/pollution/feedbacks");
      const data = await response.json();
      setFeedbacks(data); // Set the feedback messages
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  // Fetch aggregate data and feedbacks on initial load
  useEffect(() => {
    fetchAggregateData();
    fetchFeedbacks(); // Fetch feedbacks on initial load
  }, []);

  // Handle city selection change
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setLocation(selectedCity);
    fetchAggregateData(); // Fetch aggregate data immediately when city is selected
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      location,
      pollutionExperience,
      symptoms,
      duration,
      pollutionSource,
      feedbackMessage,
      feedbackRating,
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
        setFeedbackMessage("");
        setFeedbackRating(0);
        fetchAggregateData(); // Refresh aggregate data after submission
        fetchFeedbacks(); // Refresh feedbacks after submission
      } else {
        alert("Error submitting report!");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  // Handle comment fade
  const handleCommentRemoval = (id) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== id)
    );
  };

  useEffect(() => {
    if (comments.length > 0) {
      const lastComment = comments[comments.length - 1];
      // Remove comment after 5 seconds (to let it fade out)
      setTimeout(() => handleCommentRemoval(lastComment.id), 5000);
    }
  }, [comments]);

  // Hardcoded comments array
  const hardcodedComments = [
    "Pollution levels are rising rapidly!",
    "Air quality is at its worst in Delhi today.",
    "Urgent action needed to combat pollution.",
    "Our lungs are suffocating due to high pollution.",
    "Stay safe, wear masks!",
    "More green spaces could help reduce pollution.",
    "Why is construction dust not regulated?",
    "Tired of the air quality in this city.",
    "When will air purifiers become affordable?",
    "Pollution in the city is unbearable these days.",
  ];

  useEffect(() => {
    let commentIndex = 0;
    const interval = setInterval(() => {
      if (commentIndex < hardcodedComments.length) {
        setComments((prevComments) => [
          ...prevComments,
          { text: hardcodedComments[commentIndex], id: commentIndex },
        ]);
        commentIndex++;
      }
    }, 2000); // Display new comment every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pollution Report</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        {/* Form inputs here... */}
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
        <h3>Feedback</h3>
        <label>Feedback Message:</label>
        <textarea
          value={feedbackMessage}
          onChange={(e) => setFeedbackMessage(e.target.value)}
          placeholder="Share your feedback..."
          rows="4"
          cols="50"
        />
        <br />
        <label>Rating:</label>
        <select
          value={feedbackRating}
          onChange={(e) => setFeedbackRating(Number(e.target.value))}
        >
          <option value={0}>Select Rating</option>
          <option value={1}>1 - Poor</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5 - Excellent</option>
        </select>
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

      <h3>Feedbacks Received</h3>
      <p>{feedbacks.length} feedbacks received</p>
      <ul>
        {feedbacks.map((feedback, index) => (
          <li key={index}>
            <strong>{feedback.feedbackMessage}</strong>
            <br />
            Rating: {feedback.feedbackRating}
            <br />
          </li>
        ))}
      </ul>

      {/* Right side footer for comments */}
      <div className="comments-footer">
        {comments.length > 0 && (
          <div>
            {comments.map((comment, index) => (
              <div
                key={comment.id}
                className={`comment-box ${index === comments.length - 1 ? "comment-fade" : ""}`}
                style={{ display: "block" }}
              >
                {comment.text}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .comments-footer {
          position: fixed;
          bottom: 0;
          right: 0;
          width: 250px;
          background-color: black;
          color: white;
          padding: 10px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
          z-index: 100;
        }

        .comment-box {
          background-color: #333;
          padding: 8px;
          margin-bottom: 5px;
          border-radius: 5px;
        }

        .comment-fade {
          opacity: 0;
          transition: opacity 1s;
        }
      `}</style>
    </div>
  );
};

export default App;
