import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown"; // ✅ Import this
import remarkGfm from "remark-gfm"; // (optional) GitHub Flavored Markdown like tables, checkboxes

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
                ? "correct"
                : ""
            }`}
            onClick={() => handleOptionClick(i, quizData.correctoptionNumber)}
            disabled={isAnswered}
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
