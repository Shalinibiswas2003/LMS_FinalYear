import React, { useState, useEffect } from "react";

const ContentDisplay = ({
  sections,
  content,
  quiz,
  currentIndex,
  setCurrentIndex,
}) => {
  const [selectedOption, setSelectedOption] = useState(null); // Track selected option
  const [correctOption, setCorrectOption] = useState(null);  // Track correct answer
  const [isAnswered, setIsAnswered] = useState(false); // Track if the answer has been selected

  const displaySection = () => {
    const section = sections[currentIndex];

    // Ensure section is valid and exists in the content object
    if (section && content[section]) {
      return (
        <>
          <h2>{section}</h2>
          <p>{content[section]}</p>
        </>
      );
    } else {
      return <p>No content available for this section.</p>;
    }
  };

  const displayQuiz = () => {
    const section = sections[currentIndex];

    // Parse the quiz data from the string to an object
    const quizData = quiz[section] ? JSON.parse(quiz[section])[0] : null;

    console.log("quizData", quizData);  // Debug log to check if quiz data exists

    if (!quizData) {
      return <p>No quiz available for this section.</p>;
    }

    return (
      <div className="quiz-container">
        <p className="quiz-question">{quizData.question_body}</p>
        {[1, 2, 3, 4].map((i) => (
          <button
            key={i}
            className={`quiz-option ${
              selectedOption === i
                ? i === correctOption
                  ? "correct"
                  : "wrong"
                : i === correctOption
                ? "correct" // Always show the correct answer if not selected
                : ""
            }`}
            onClick={() => handleOptionClick(i, quizData.correctoptionNumber)}
            disabled={isAnswered} // Disable buttons after answer is selected
          >
            {quizData[`option${i}`]}
          </button>
        ))}
      </div>
    );
  };

  const handleOptionClick = (selected, correct) => {
    setSelectedOption(selected);
    setCorrectOption(correct);
    setIsAnswered(true); // Lock answer after selection
  };

  const resetQuizState = () => {
    setSelectedOption(null);
    setCorrectOption(null);
    setIsAnswered(false);
  };

  useEffect(() => {
    resetQuizState(); // Reset state when currentIndex changes
  }, [currentIndex]);

  return (
    <div className="content-display">
      {displaySection()}
      {quiz[sections[currentIndex]] && displayQuiz()} {/* Only show quiz if available */}
      <div className="navigation-buttons">
        <button
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => prev + 1)}
          disabled={currentIndex === sections.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ContentDisplay;
