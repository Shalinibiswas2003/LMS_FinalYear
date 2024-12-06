import React from "react";


const ContentDisplay = ({
  sections,
  content,
  quiz,
  currentIndex,
  setCurrentIndex,
}) => {
  const displaySection = () => {
    const section = sections[currentIndex];
    return (
      <>
        <h2>{section}</h2>
        <p>{content[section]}</p>
      </>
    );
  };

  const displayQuiz = () => {
    const quizData = JSON.parse(quiz[sections[currentIndex]])[0];
    return (
      <div className="quiz-container">
        <p className="quiz-question">{quizData.question_body}</p>
        {[1, 2, 3, 4].map((i) => (
          <button
            key={i}
            className="quiz-option"
            onClick={() => checkAnswer(i, quizData.correctoptionNumber)}
          >
            {quizData[`option${i}`]}
          </button>
        ))}
      </div>
    );
  };

  const checkAnswer = (selectedOption, correctOption) => {
    const options = document.querySelectorAll(".quiz-option");
    options.forEach((btn, index) => {
      if (index + 1 === correctOption) {
        btn.classList.add("correct");
      } else if (index + 1 === selectedOption) {
        btn.classList.add("wrong");
      }
      btn.disabled = true;
    });
  };

  return (
    <div className="content-display">
      {displaySection()}
      {displayQuiz()}
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
