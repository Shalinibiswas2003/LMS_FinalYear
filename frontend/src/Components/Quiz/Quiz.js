import React, { useState, useEffect } from "react";
import './Quiz.css'; 

const Quiz = ({ quizData, onNext }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  useEffect(() => {
    console.log("quizData received:", quizData); // Debugging log
    if (!quizData) {
      console.error("Error: quizData prop is missing or invalid.");
      return;
    }
    
    // Directly using quizData, no need to parse it
    if (Array.isArray(quizData) && quizData.length > 0) {
      setCurrentQuiz(quizData[0]); // Set the first quiz question.
    } else {
      console.error("Error: quizData is not a valid array or is empty.");
    }
  }, [quizData]);

  const handleOptionClick = (optionNumber) => {
    console.log("Option clicked:", optionNumber); // Debugging log
    setSelectedOption(optionNumber);
  };

  const handleNextClick = () => {
    console.log("Next button clicked"); // Debugging log
    if (!currentQuiz) {
      console.error("Error: currentQuiz is not loaded.");
      return;
    }
    if (onNext) {
      try {
        onNext();
      } catch (error) {
        console.error("Error: onNext function failed", error);
      }
    }
  };

  if (!currentQuiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quiz-container">
      <h2>{currentQuiz.question_body}</h2>
      <div className="options-container">
        {Array.from({ length: 4 }, (_, i) => i + 1).map((optionNumber) => (
          <button
            key={optionNumber}
            className={`quiz-option 
              ${selectedOption 
                ? optionNumber === currentQuiz.correctoptionNumber
                  ? "correct"
                  : optionNumber === selectedOption
                  ? "wrong"
                  : ""
                : ""}`}
            onClick={() => handleOptionClick(optionNumber)}
            disabled={selectedOption !== null}
          >
            {currentQuiz[`option${optionNumber}`]}
          </button>
        ))}
      </div>
      {selectedOption !== null && (
        <div className="result-message">
          {selectedOption === currentQuiz.correctoptionNumber
            ? "Correct Answer!"
            : "Wrong Answer! Try Again!"}
        </div>
      )}
      <button
        onClick={handleNextClick}
        className="next-button"
        disabled={selectedOption === null}
      >
        Next
      </button>
    </div>
  );
};

export default Quiz;
