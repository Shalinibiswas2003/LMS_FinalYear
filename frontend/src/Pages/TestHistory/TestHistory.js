import React, { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "../../supabaseClient";

const TestHistory = () => {
  const user = useUser();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Track which test IDs are expanded
  const [expandedTests, setExpandedTests] = useState({});

  useEffect(() => {
    if (!user?.id) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("test_results")
          .select(`
            *,
            courses:course_id (
              id,
              course_name
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setResults(data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch test results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  const toggleExpand = (id) => {
    setExpandedTests((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) return <p>Loading your test history...</p>;
  if (!user) return <p>Please log in to view your test history.</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!results.length) return <p>No test results found.</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto", color: "#fff" }}>
      <h1 style={{ color: "rgb(255, 111, 0)" }}>Your Test History</h1>

      {results.map((result) => {
        let answersObj = {};
        try {
          answersObj =
            typeof result.answers === "string"
              ? JSON.parse(result.answers)
              : result.answers;
        } catch {
          answersObj = {};
        }

        const isExpanded = expandedTests[result.id];

        return (
          <div
            key={result.id}
            style={{
              backgroundColor: "rgb(81 48 0)",
              padding: "15px",
              marginBottom: "25px",
              borderRadius: "8px",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <h2
              onClick={() => toggleExpand(result.id)}
              style={{
                color: "#FFA500",
                margin: 0,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              Course: {result.courses?.course_name || "Unknown Course"}
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              >
                ▶
              </span>
            </h2>
            <p style={{ marginTop: "5px" }}>
              Score: {result.score} / {result.total_questions} &nbsp;|&nbsp; Date:{" "}
              {new Date(result.created_at).toLocaleString()}
            </p>

            {isExpanded && (
              <>
                {Object.entries(answersObj).length === 0 && (
                  <p>No answers recorded for this test.</p>
                )}

                {Object.entries(answersObj).map(([key, answerData]) => (
                  <div
                    key={key}
                    style={{
                      marginBottom: "12px",
                      padding: "8px",
                      backgroundColor: "rgba(255 111 0 / 0.1)",
                      borderRadius: "6px",
                    }}
                  >
                    <p>
                      <strong>Q{parseInt(key) + 1}:</strong>{" "}
                      {answerData.question_body}
                    </p>
                    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                      {["option1", "option2", "option3", "option4"].map(
                        (optKey) => {
                          const optionText = answerData[optKey];
                          if (!optionText) return null;

                          const isCorrect = optionText === answerData.correctAnswer;
                          const isUserAnswer = optionText === answerData.userAnswer;

                          return (
                            <li
                              key={optKey}
                              style={{
                                color: isCorrect
                                  ? "#4CAF50"
                                  : isUserAnswer
                                  ? "#F44336"
                                  : "#fff",
                                fontWeight: isCorrect ? "bold" : "normal",
                                textDecoration:
                                  isUserAnswer && !isCorrect ? "line-through" : "none",
                                marginBottom: "4px",
                              }}
                            >
                              {optionText} {isCorrect && "✓"}
                              {isUserAnswer && !isCorrect && "✗"}
                            </li>
                          );
                        }
                      )}
                    </ul>

                    <p style={{ fontStyle: "italic" }}>
                      Your answer:{" "}
                      <strong
                        style={{
                          color:
                            answerData.userAnswer === answerData.correctAnswer
                              ? "#4CAF50"
                              : "#F44336",
                        }}
                      >
                        {answerData.userAnswer || "No answer given"}
                      </strong>
                    </p>
                    {answerData.userAnswer !== answerData.correctAnswer && (
                      <p>
                        Correct answer: <strong>{answerData.correctAnswer}</strong>
                      </p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TestHistory;
