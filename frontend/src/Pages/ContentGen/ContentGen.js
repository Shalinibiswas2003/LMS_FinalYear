import React, { useState } from "react";
import Form from "../../Components/Form/Form";
import ContentDisplay from "../../Components/ContentDisplay/ContentDisplay";
import "./ContentGen.css";

const ContentGen = () => {
  const [sections, setSections] = useState([]);
  const [content, setContent] = useState({});
  const [quiz, setQuiz] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(""); // To handle error state

  const handleFormSubmit = (formData) => {
    setLoading(true); // Start loading when the form is submitted
    setError(""); // Reset any previous errors

    // Debugging log to verify data being sent
    console.log("Sending form data to backend:", formData);

    fetch("http://127.0.0.1:5001/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), // Send formData as JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to generate content");
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful response
        console.log("Received data:", data);
        setSections(data.sections || []);
        setContent(data.content || {});
        setQuiz(data.quiz || {});
        setCurrentIndex(0);
        setLoading(false); // Stop loading after receiving the response
      })
      .catch((error) => {
        setError(error.message); // Set error message if any error occurs
        setLoading(false); // Stop loading in case of an error
        console.error("Error:", error);
      });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100vh" }}>
      <div className="content-gen-container">
        <h1>Course Content Generator</h1>
        {loading && <p>Loading...</p>} {/* Display loading message */}
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
        {sections.length === 0 ? (
          <Form onSubmit={handleFormSubmit} />
        ) : (
          <ContentDisplay
            sections={sections}
            content={content}
            quiz={quiz}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        )}
      </div>
    </div>
  );
};

export default ContentGen;