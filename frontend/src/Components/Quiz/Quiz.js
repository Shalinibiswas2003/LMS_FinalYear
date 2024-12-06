import React, { useState } from "react";

const Quiz = ({ quizData }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const quiz = JSON.parse(quizData)[0];

  const handleOptionClick = (optionNumber) => {
    setSelectedOption(optionNumber);
  };

  return (
    <div className="quiz-container">
      <p>{quiz.question_body}</p>
      {Array.from({ length: 4 }, (_, i) => i + 1).map((optionNumber) => (
        <button
          key={optionNumber}
          className={`quiz-option ${
            selectedOption
              ? optionNumber === quiz.correctoptionNumber
                ? "correct"
                : optionNumber === selectedOption
                ? "wrong"
                : ""
              : ""
          }`}
          onClick={() => handleOptionClick(optionNumber)}
          disabled={selectedOption !== null}
        >
          {quiz[`option${optionNumber}`]}
        </button>
      ))}
    </div>
  );
};

export default Quiz;
