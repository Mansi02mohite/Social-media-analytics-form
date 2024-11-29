import React, { useState, useEffect } from "react";

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

const CommentsPopup = ({ setComments }) => {
  const [commentIndex, setCommentIndex] = useState(0);

  useEffect(() => {
    if (commentIndex < hardcodedComments.length) {
      const interval = setInterval(() => {
        setComments((prevComments) => [
          ...prevComments,
          { text: hardcodedComments[commentIndex], id: commentIndex },
        ]);
        setCommentIndex((prevIndex) => prevIndex + 1);
      }, 2000); // Display new comment every 2 seconds

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [commentIndex, setComments]);

  return (
    <div>
      <style>
        {`
          .comment-footer {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            max-width: 250px;
            animation: fadeIn 2s ease-in-out;
          }

          .comment-text {
            animation: fadeIn 2s ease-in-out;
          }

          .comment-fade {
            animation: fadeOut 2s ease-in-out;
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          @keyframes fadeOut {
            0% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CommentsPopup;
