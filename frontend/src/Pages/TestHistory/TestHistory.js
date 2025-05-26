import React, { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "../../supabaseClient";
import "./TestHistory.css";
import Navbar from "../../Components/Navbar/Navbar";

const TestHistory = () => {
  const user = useUser();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedTests, setExpandedTests] = useState({});

  useEffect(() => {
    if (!user?.id) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      const cached = localStorage.getItem("test_history_cache");
      const cacheTime = localStorage.getItem("test_history_cache_time");

      const isCacheValid =
        cached && cacheTime && Date.now() - cacheTime < 5 * 60 * 1000; // 5 mins

      if (isCacheValid) {
        setResults(JSON.parse(cached));
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("test_results")
          .select(
            `*,
            courses:course_id (
              id,
              course_name
            )`
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setResults(data || []);
        localStorage.setItem("test_history_cache", JSON.stringify(data));
        localStorage.setItem("test_history_cache_time", Date.now().toString());
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
    <>
    <Navbar/>
    <div className="test-history-container">
      <h1 className="test-history-heading">Your Test History</h1>

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
            className="test-result"
            onClick={() => toggleExpand(result.id)}
          >
            <h2 className="test-result-header">
              Course: {result.courses?.course_name || "Unknown Course"}
              <span
                className={`expand-icon ${isExpanded ? "rotated" : ""}`}
              >
                ▶
              </span>
            </h2>
            <p className="test-result-meta">
              Score: {result.score} / {result.total_questions} &nbsp;|&nbsp; Date:{" "}
              {new Date(result.created_at).toLocaleString()}
            </p>

            {isExpanded && (
              <>
                {Object.entries(answersObj).length === 0 && (
                  <p>No answers recorded for this test.</p>
                )}

                {Object.entries(answersObj).map(([key, answerData]) => (
                  <div key={key} className="answer-block">
                    <p>
                      <strong>Q{parseInt(key) + 1}:</strong>{" "}
                      {answerData.question_body}
                    </p>
                    <ul className="answer-options">
                      {["option1", "option2", "option3", "option4"].map((optKey) => {
                        const optionText = answerData[optKey];
                        if (!optionText) return null;

                        const isCorrect = optionText === answerData.correctAnswer;
                        const isUserAnswer =
                          optionText === answerData.userAnswer;

                        return (
                          <li
                            key={optKey}
                            className={
                              isCorrect
                                ? "answer-correct"
                                : isUserAnswer
                                ? "answer-wrong"
                                : ""
                            }
                          >
                            {optionText}
                            {isCorrect && " ✓"}
                            {isUserAnswer && !isCorrect && " ✗"}
                          </li>
                        );
                      })}
                    </ul>
                    <p className="answer-user">
                      Your answer:{" "}
                      <strong
                        className={
                          answerData.userAnswer === answerData.correctAnswer
                            ? "answer-correct"
                            : "answer-wrong"
                        }
                      >
                        {answerData.userAnswer || "No answer given"}
                      </strong>
                    </p>
                    {answerData.userAnswer !== answerData.correctAnswer && (
                      <p>
                        Correct answer:{" "}
                        <strong>{answerData.correctAnswer}</strong>
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
    </>
  );
};

export default TestHistory;
