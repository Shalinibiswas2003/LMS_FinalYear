import React, { useEffect, useState } from 'react';

const TestPage = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem('testData');
    if (!raw) return;
  
    try {
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        setQuestions(data);
      } else if (data.questions) {
        setQuestions(data.questions);
      } else {
        console.error('Unexpected data structure:', data);
      }
    } catch (e) {
      console.error('Error parsing test data:', e);
    }
  }, []);

  if (!questions.length) return <p>Loading test...</p>;

  // Render the test questions (same as before)
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>🧪 Course Test</h1>
      {questions.map((q, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: "25px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <p>
            <strong>Q{idx + 1}:</strong> {q.question_body}
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => (
              <li key={i} style={{ margin: "4px 0" }}>
                <label>
                  <input type="radio" name={`q${idx}`} value={opt} disabled />{" "}
                  {opt}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TestPage;