import React from "react";
import "./ResultDisplay.css";
import Robot from "../../Assets/Robot.jpg";
import { useNavigate } from "react-router-dom";

const ResultDisplay = ({ score, total }) => {
  const percentage = ((score / total) * 100).toFixed(2);
  const navigate = useNavigate();

  let message = "";
  if (percentage > 75) {
    message = "Well done!";
  } else if (percentage >= 35) {
    message = "Great, but you can do better!";
  } else {
    message = "Better luck next time";
  }

  return (
    <div className="result-container">
      <p className="score-text">SCORE: {score}/{total}</p>
      <div className="progress-ring">
        <svg viewBox="0 0 36 36" className="circular-chart">
          <path
            className="circle-bg"
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="circle"
            strokeDasharray={`${percentage}, 100`}
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" className="percentage-text">
            {percentage} %
          </text>
        </svg>
      </div>
      <div className="robot-section">
  <div className="robot-talk">
    <img src={Robot} alt="Robot" className="robot-img" />
    <div className="speech-bubble">{message}</div>
  </div>

  <button className="dashboard-button" onClick={() => navigate("/dashboard")}>
    Return to Dashboard
  </button>
</div>
    </div>
  );
};

export default ResultDisplay;
