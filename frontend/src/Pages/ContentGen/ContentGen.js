import React, { useState } from "react";
import Form from "../../Components/Form/Form";
import ContentDisplay from "../../Components/ContentDisplay/ContentDisplay";
import "./ContentGen.css"; // Dedicated CSS file for styling

const ContentGen = () => {
  const [sections, setSections] = useState([]);
  const [content, setContent] = useState({});
  const [quiz, setQuiz] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFormSubmit = (formData) => {
    fetch("/generate", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setSections(data.sections);
        setContent(data.content);
        setQuiz(data.quiz);
        setCurrentIndex(0);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div style={{display:"flex",justifyContent:"center",height:"100vh"}}>
    <div className="content-gen-container">
      <h1>Course Content Generator</h1>
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
