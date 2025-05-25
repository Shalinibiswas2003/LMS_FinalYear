import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./TestDemo.css"

const TestPageDemo = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(3600); // 1 hour
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch authenticated user
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    // Load test data from localStorage
    const raw = localStorage.getItem("testData");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
          setQuestions(data);
        }
      } catch (error) {
        console.error("Failed to parse test data:", error);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOptionSelect = (questionId, optionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleSubmit = async () => {
    if (!user) return toast.error("User not found. Please login again.");

    if (window.confirm("Are you sure you want to submit the quiz?")) {
      try {
        let score = 0;
        const batchInserts = [];

        for (let q of questions) {
          const selectedAnswer = answers[q.id];
          if (selectedAnswer === q.correct_answer) {
            score++;
          }

          batchInserts.push(
            supabase.from("student_answers").insert({
              user_id: user.id,
              question_id: q.id,
              selected_answer: selectedAnswer || null,
              course_id: q.course_id,
            })
          );
        }

        await Promise.all(batchInserts);

        const percentage = (score / questions.length) * 100;
        const courseId = localStorage.getItem("courseId");

        await supabase.from("test_results").insert({
          user_id: user.id,
          course_id: courseId,
          score,
          total: questions.length,
          percentage,
        });

        localStorage.removeItem("testData");
        localStorage.removeItem("courseId");

        toast.success("Quiz submitted successfully!");
        navigate("/test-history");
      } catch (error) {
        toast.error("Submission failed");
        console.error("Submission error:", error);
      }
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")} : ${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`;
  };

  if (questions.length === 0) return <div className="loading">Loading questions...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="edu-synth-container">
      {/* Header */}
      <header className="edu-header">
        <h1>EduSynth</h1>
        <nav>
          <span>Hi, {user?.user_metadata?.full_name || "User"}</span>
          <button onClick={() => supabase.auth.signOut()}>LOG OUT</button>
        </nav>
      </header>

      {/* Main Layout */}
      <div className="quiz-layout">
        {/* Sidebar */}
        <aside className="quiz-sidebar">
          <div className="time-display">
            <span>{formatTime(timer)}</span>
          </div>

          <button className="submit-btn" onClick={handleSubmit}>
            SUBMIT
          </button>
        </aside>

        {/* Question Section */}
        <main className="quiz-content">
          <h2>Question {currentQuestionIndex + 1}</h2>

          <div className="question-container">
            <h3>{currentQuestion.question_text}</h3>
            <div className="options-grid">
              {currentQuestion.options ? (
                Object.entries(currentQuestion.options).map(([key, value]) => (
                  <div
                    key={key}
                    className={`option-card ${answers[currentQuestion.id] === key ? "selected" : ""}`}
                    onClick={() => handleOptionSelect(currentQuestion.id, key)}
                  >
                    <span className="option-letter">{key}.</span>
                    <span className="option-text">{value}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: "red" }}>Options not available for this question.</p>
              )}
            </div>
          </div>

          <div className="question-nav">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>Page {currentQuestionIndex + 1}</span>
            <button
              disabled={currentQuestionIndex === questions.length - 1}
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TestPageDemo;
