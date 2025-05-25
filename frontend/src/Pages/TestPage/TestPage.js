import React, { useEffect, useState, useRef } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "../../supabaseClient";
import Navbar from "../../Components/Navbar/Navbar";

const TestPage = () => {
  const user = useUser();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [timer, setTimer] = useState(1800); // 1 hour in seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const timerRef = useRef();
 

  // Load questions and correct answers
  useEffect(() => {
    const raw = localStorage.getItem("testData");
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        setQuestions(data);
        const corrects = {};
        data.forEach((q, i) => {
          corrects[i] = q[`option${q.correctoptionNumber}`];
        });
        setCorrectAnswers(corrects);
      } else {
        console.error("Unexpected data structure:", data);
      }
    } catch (e) {
      console.error("Error parsing test data:", e);
    }
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (submitted) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(timerRef.current);
          if (!submitted) handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [submitted]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")} : ${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`;
  };

  const handleAnswerChange = (qIndex, selectedOption) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: selectedOption,
    }));
  };

  const saveTestResults = async (score, fullAnswers) => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const courseId = localStorage.getItem("courseId");
    console.log("courseId from localStorage:", courseId);

    if (!user || !courseId) {
      setSaveError("Test results couldn't be saved. Missing user or course data.");
      setIsSaving(false);
      return;
    }

    try {
      const { error } = await supabase.from("test_results").insert([
        {
          user_id: user.id,
          course_id: courseId,
          score: score,
          total_questions: questions.length,
          answers: fullAnswers,
        },
      ]);

      if (error) throw error;

      setSaveSuccess(true);
      localStorage.removeItem("testData");
      localStorage.removeItem("courseId");
    } catch (error) {
      console.error("Error saving test results:", error);
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    let count = 0;
    questions.forEach((q, i) => {
      if (answers[i] !== undefined && answers[i] === q[`option${q.correctoptionNumber}`]) {
        count += 1;
      }
    });
    setScore(count);
    setSubmitted(true);

    // Prepare full answers
    const fullAnswers = {};
    questions.forEach((q, i) => {
      fullAnswers[i] = {
        question_body: q.question_body,
        option1: q.option1,
        option2: q.option2,
        option3: q.option3,
        option4: q.option4,
        correctoptionNumber: q.correctoptionNumber,
        correctAnswer: q[`option${q.correctoptionNumber}`],
        userAnswer: answers[i] || null,
      };
    });

    await saveTestResults(count, fullAnswers);
  };

  const getAnswerStatus = (questionIndex, option) => {
    if (!submitted) return "";
    const userAnswer = answers[questionIndex];
    const correctAnswer = correctAnswers[questionIndex];
    if (option === correctAnswer) return "✓";
    if (option === userAnswer && userAnswer !== correctAnswer) return "✗";
    return "";
  };

  const getAnswerStyle = (questionIndex, option) => {
    if (!submitted) return {};
    const userAnswer = answers[questionIndex];
    const correctAnswer = correctAnswers[questionIndex];
    if (option === correctAnswer) {
      return { color: "#4CAF50", fontWeight: "bold" };
    }
    if (option === userAnswer && userAnswer !== correctAnswer) {
      return { color: "#F44336", textDecoration: "line-through" };
    }
    return {};
  };

  if (!questions.length) return <p>Loading test...</p>;

  return (
    <>
      <style>{`
        .container {
          
          max-width: 900px;
          margin: 0 auto;
          
          color: #fff;
          font-family: Arial, sans-serif;
          min-height: 100vh;
          position:relative;
          top: 15rem;
        }
        .timer {
          font-size: 1.5rem;
          font-weight: bold;
          color: black;
          text-align: right;
          margin-bottom: 5rem;
          user-select: none;
        }
          .timer-box {
  background-color: #4a787d; /* your main color */
  color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 12px 25px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(74, 120, 125, 0.5);
  width: 290px;
  text-align: center;
  user-select: none;
  margin-bottom: 3rem;
  margin-left: auto; /* align right */
  margin-right: 0;
}
        .question-nav-box {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 20px;
          gap: 8px;
        }
        .question-nav-box button {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          background-color: #333;
          color: white;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s ease;
          user-select: none;
        }
        .question-nav-box button:hover {
          background-color: #555;
        }
        .question-nav-box button.attempted {
          background-color: #4a787d;
          color: white;
        }
        .question-nav-box button.current {
          box-shadow: 0 0 10px #4a787d;
          border: 2px solid #4a787d;
        }
        .question-card {
          margin-bottom: 25px;
          padding: 15px 20px;
          border-radius: 8px;
          height:20rem;
          display:flex;
              flex-direction: column;
              justify-content: space-evenly;
          color:black;
        }
        .question-card p {
          font-size: 1.1rem;
          margin-bottom: 10px;
        }
        .options-list {
          list-style: none;
          padding: 0;
        }
        .options-list li {
          margin: 6px 0;
        }
        .options-list label {
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }
        .options-list input[type="radio"] {
          margin-right: 8px;
          cursor: pointer;
        }
        .submit-btn {
          margin-top: 20px;
          padding: 10px 30px;
          background-color: #4a787d;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          user-select: none;
          margin-left:25rem;
        }
        .submit-btn:disabled {
          background-color: #023a40;
          cursor: not-allowed;
        }
        .score-display {
          margin-top: 20px;
          font-size: 1.3rem;
          text-align: center;
          font-weight: bold;
        }
        .score-display.green {
          color: #4CAF50;
        }
        .score-display.red {
          color: #F44336;
        }
        .answer-status {
          margin-top: 8px;
          font-style: italic;
        }
        .answer-status.correct {
          color: #4CAF50;
        }
        .answer-status.incorrect {
          color: #F44336;
        }
        .save-message {
          margin-bottom: 15px;
          text-align: center;
          font-weight: 600;
        }
        .save-message.error {
          color: #F44336;
        }
        .save-message.success {
          color: #4CAF50;
        }
      `}</style>
      <Navbar/>
      <div className="container">
       <div className="timer-box" role="timer" aria-live="polite" aria-atomic="true">
  Time Remaining: {formatTime(timer)}
</div>

        <div className="question-nav-box" aria-label="Question Navigation">
          {questions.map((_, i) => {
            const attempted = answers[i] !== undefined;
            const isCurrent = currentQuestionIndex === i;
            return (
              <button
                key={i}
                type="button"
                className={`${attempted ? "attempted" : ""} ${isCurrent ? "current" : ""}`}
                onClick={() => setCurrentQuestionIndex(i)}
                aria-current={isCurrent ? "true" : undefined}
                aria-label={`Go to question ${i + 1}${attempted ? ", attempted" : ""}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Display only the current question */}
        <div className="question-card" aria-live="polite" aria-atomic="true">
          <p>
            <strong>
              Question {currentQuestionIndex + 1} of {questions.length}:
            </strong>{" "}
            {questions[currentQuestionIndex].question_body}
          </p>
          <ul className="options-list">
            {[1, 2, 3, 4].map((optNum) => {
              const optionText = questions[currentQuestionIndex][`option${optNum}`];
              const answerStatus = getAnswerStatus(currentQuestionIndex, optionText);
              const answerStyle = getAnswerStyle(currentQuestionIndex, optionText);
              return (
                <li key={optNum}>
                  <label style={answerStyle}>
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={optionText}
                      checked={answers[currentQuestionIndex] === optionText}
                      onChange={() => handleAnswerChange(currentQuestionIndex, optionText)}
                      disabled={submitted}
                    />
                    {optionText} {answerStatus && <span aria-hidden="true"> {answerStatus}</span>}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={submitted || Object.keys(answers).length === 0 || isSaving}
          aria-disabled={submitted || Object.keys(answers).length === 0 || isSaving}
        >
          {submitted ? "Test Submitted" : isSaving ? "Saving..." : "Submit Test"}
        </button>

        {saveError && <p className="save-message error" role="alert">Error: {saveError}</p>}
        {saveSuccess && <p className="save-message success" role="alert" style={{margin:"2rem"}}>Test results saved successfully!</p>}

        {submitted && (
          <p
            className={`score-display ${
              score >= questions.length / 2 ? "green" : "red"
            }`}
            aria-live="polite"
          >
            You scored {score} out of {questions.length}
          </p>
        )}
      </div>
    </>
  );
};

export default TestPage;
