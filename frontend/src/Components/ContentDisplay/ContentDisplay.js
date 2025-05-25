import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ContentDisplay = ({
  sections,
  content,
  quiz,
  currentIndex,
  setCurrentIndex,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const displaySection = () => {
    const section = sections[currentIndex];

    if (section && content[section]) {
      return (
        <>
          <h2>{section}</h2>
          <div className="markdown-content" style={{ whiteSpace: "pre-wrap" }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content[section]}
            </ReactMarkdown>
          </div>
        </>
      );
    } else {
      return <p>No content available for this section.</p>;
    }
  };

  const displayQuiz = () => {
    const section = sections[currentIndex];
    const quizData = quiz[section] ? JSON.parse(quiz[section])[0] : null;

    if (!quizData) {
      return <p>No quiz available for this section.</p>;
    }

    return (
      <div className="quiz-container" style={{ textAlign: "center" }}>
        <h3>Quick Quiz</h3>
        <p className="quiz-question">Q) {quizData.question_body}</p>

        {[0, 1].map((row) => (
          <div
            key={row}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "10px",
              gap: "15px",
            }}
          >
            {[1, 2].map((col) => {
              const i = row * 2 + col;
              return (
                <button
                  key={i}
                  className={`quiz-option ${
                    selectedOption === i
                      ? i === correctOption
                        ? "correct"
                        : "wrong"
                      : i === correctOption
                      ? "correct"
                      : ""
                  }`}
                  onClick={() =>
                    handleOptionClick(i, quizData.correctoptionNumber)
                  }
                  disabled={isAnswered}
                  style={{
                    padding: "10px 20px",
                    minWidth: "150px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    backgroundColor:
                      selectedOption === i
                        ? i === correctOption
                          ? "#4caf50"
                          : "#f44336"
                        : "#f0f0f0",
                    color:
                      selectedOption === i || i === correctOption
                        ? "#fff"
                        : "#000",
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                >
                  {quizData[`option${i}`]}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const handleOptionClick = (selected, correct) => {
    setSelectedOption(selected);
    setCorrectOption(correct);
    setIsAnswered(true);
  };

  const resetQuizState = () => {
    setSelectedOption(null);
    setCorrectOption(null);
    setIsAnswered(false);
  };

  useEffect(() => {
    resetQuizState();
  }, [currentIndex]);

  return (
    <div className="content-display">
      {displaySection()}
      {quiz[sections[currentIndex]] && displayQuiz()}
      <div
        className="navigation-buttons"
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <div
  onClick={() => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  }}
  style={{
    fontSize: "50px",
    padding: "8px 16px",
    cursor: currentIndex === 0 ? "not-allowed" : "pointer",
    opacity: currentIndex === 0 ? 0.4 : 1,
    borderRadius: "6px",
    fontWeight: "bolder",
    color: "#4a787d",
  }}
>
  ←
</div>
<div
  onClick={() => {
    if (currentIndex < sections.length - 1) setCurrentIndex((prev) => prev + 1);
  }}
  style={{
    fontSize: "50px",
    padding: "8px 16px",
    cursor: currentIndex === sections.length - 1 ? "not-allowed" : "pointer",
    opacity: currentIndex === sections.length - 1 ? 0.4 : 1,
    borderRadius: "6px",
    fontWeight: "bolder",
    color: "#4a787d",
  }}
>
  →
</div>
      </div>
    </div>
  );
};

export default ContentDisplay;
