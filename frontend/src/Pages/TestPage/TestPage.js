import React, { useEffect, useState } from 'react';
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "../../supabaseClient";

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

  useEffect(() => {
    const raw = localStorage.getItem('testData');
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
        console.error('Unexpected data structure:', data);
      }
    } catch (e) {
      console.error('Error parsing test data:', e);
    }
  }, []);

  const handleAnswerChange = (qIndex, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: selectedOption,
    }));
  };

  const saveTestResults = async (score, fullAnswers) => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const courseId = localStorage.getItem('courseId');
    
    if (!user || !courseId) {
      setSaveError("Test results couldn't be saved. Missing user or course data.");
      setIsSaving(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("test_results")
        .insert([
          {
            user_id: user.id,
            course_id: courseId,
            score: score,
            total_questions: questions.length,
            answers: fullAnswers,
          }
        ]);

      if (error) throw error;

      setSaveSuccess(true);
      localStorage.removeItem('testData');
      localStorage.removeItem('courseId');
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
        userAnswer: answers[i] || null
      };
    });

    await saveTestResults(count, fullAnswers);
  };

  const getAnswerStatus = (questionIndex, option) => {
    if (!submitted) return '';
    const userAnswer = answers[questionIndex];
    const correctAnswer = correctAnswers[questionIndex];
    if (option === correctAnswer) return '✓';
    if (option === userAnswer && userAnswer !== correctAnswer) return '✗';
    return '';
  };

  const getAnswerStyle = (questionIndex, option) => {
    if (!submitted) return {};
    const userAnswer = answers[questionIndex];
    const correctAnswer = correctAnswers[questionIndex];
    if (option === correctAnswer) {
      return { color: '#4CAF50', fontWeight: 'bold' };
    }
    if (option === userAnswer && userAnswer !== correctAnswer) {
      return { color: '#F44336', textDecoration: 'line-through' };
    }
    return {};
  };

  if (!questions.length) return <p>Loading test...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", backgroundColor: "rgb(255 111 0 / 0%)", color: "#fff" }}>
      <h1 style={{ color: 'rgb(255, 111, 0)' }}>🧪 Course Test</h1>

      {saveError && (
        <div style={{ color: "red", marginBottom: "15px" }}>
          Error saving results: {saveError}
        </div>
      )}

      {saveSuccess && (
        <div style={{ color: "green", marginBottom: "15px" }}>
          Test results saved successfully!
        </div>
      )}

      {questions.map((q, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: "25px",
            padding: "10px",
            border: "1px solid rgba(255, 140, 0, 0)",
            borderRadius: "8px",
            backgroundColor: "rgb(81 48 0)",
          }}
        >
          <p>
            <strong>Q{idx + 1}:</strong> {q.question_body}
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => (
              <li key={i} style={{ margin: "4px 0" }}>
                <label style={{ display: 'flex', alignItems: 'center', ...getAnswerStyle(idx, opt) }}>
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value={opt}
                    checked={answers[idx] === opt}
                    onChange={() => handleAnswerChange(idx, opt)}
                    disabled={submitted}
                    style={{ marginRight: '8px' }}
                  />
                  {opt}
                  <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>
                    {getAnswerStatus(idx, opt)}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          {submitted && (
            <div style={{ marginTop: '8px', fontStyle: 'italic' }}>
              {answers[idx] === correctAnswers[idx] ? (
                <span style={{ color: '#4CAF50' }}>Correct!</span>
              ) : (
                <span style={{ color: '#F44336' }}>
                  The correct answer was: {correctAnswers[idx]}
                </span>
              )}
            </div>
          )}
        </div>
      ))}

      {!submitted && (
        <button
          onClick={handleSubmit}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#FF6F00",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          disabled={isSaving}
        >
          {isSaving ? "Submitting..." : "Submit Test"}
        </button>
      )}

      {submitted && (
        <div
          style={{
            marginTop: "20px",
            fontSize: "18px",
            color: score > questions.length / 2 ? "green" : "red",
          }}
        >
          You scored {score} out of {questions.length}
        </div>
      )}
    </div>
  );
};

export default TestPage;
