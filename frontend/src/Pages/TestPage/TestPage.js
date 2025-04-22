import React, { useEffect, useState } from 'react';

const TestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('testData');
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      console.log(data);
      if (Array.isArray(data)) {
        setQuestions(data);
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

  const handleSubmit = () => {
    let count = 0;
    questions.forEach((q, i) => {
      if (answers[i] !== undefined && answers[i] === q[`option${q.correctoptionNumber}`]) {
        count += 1;
      }
    });
    setScore(count);
    setSubmitted(true);
  };

  if (!questions.length) return <p>Loading test...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", backgroundColor: "rgb(255 111 0 / 0%)", color: "#fff" }}>
      <h1 style={{color:'rgb(255, 111, 0)'}}>🧪 Course Test</h1>
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
                <label>
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value={opt}
                    checked={answers[idx] === opt}
                    onChange={() => handleAnswerChange(idx, opt)}
                    disabled={submitted}
                  />{" "}
                  {opt}
                </label>
              </li>
            ))}
          </ul>
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
        >
          Submit Test
        </button>
      )}

      {submitted && (
        <div
          style={{
            marginTop: "20px",
            fontSize: "18px",
            color: score > 3 ? "green" : "red",
          }}
        >
           You scored {score} out of {questions.length}
        </div>
      )}
    </div>
  );
};

export default TestPage;
