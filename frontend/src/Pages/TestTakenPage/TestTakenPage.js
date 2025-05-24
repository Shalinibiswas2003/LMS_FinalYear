import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const TestsTakenPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      const user = supabase.auth.user();
      if (!user) {
        setTests([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("test_results")
        .select(`
          id,
          score,
          total_questions,
          taken_at,
          courses(course_name)
        `)
        .eq("user_id", user.id)
        .order("taken_at", { ascending: false });

      if (error) {
        console.error("Error fetching tests:", error);
      } else {
        setTests(data);
      }
      setLoading(false);
    };

    fetchTests();
  }, []);

  if (loading) return <p>Loading tests...</p>;
  if (!tests.length) return <p>No tests taken yet.</p>;

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        color: "#fff",
      }}
    >
      <h1 style={{ color: "#FF6F00" }}>Your Test Results</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tests.map((test) => (
          <li
            key={test.id}
            style={{
              marginBottom: "15px",
              backgroundColor: "rgb(81 48 0)",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <strong>Course:</strong> {test.courses.course_name} <br />
            <strong>Score:</strong> {test.score} / {test.total_questions} <br />
            <strong>Date:</strong> {new Date(test.taken_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestsTakenPage;
