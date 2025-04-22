import React, { useState, useEffect } from "react";
import Form from "../../Components/Form/Form";
import ContentDisplay from "../../Components/ContentDisplay/ContentDisplay";
import { supabase } from "../../supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import "./ContentGen.css";

const ContentGen = () => {
  const user = useUser(); // Get current user
  const [savedCourses, setSavedCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [content, setContent] = useState({});
  const [quiz, setQuiz] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (user) fetchSavedCourses();
  }, [user]);

  const fetchSavedCourses = async () => {
    if (!user || !user.id) return;

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching courses:", error);
    } else {
      setSavedCourses(data);
    }
  };

  const saveCourseToDB = async (formData, sections, content, quiz) => {
    if (!user || !user.id) {
      console.error("User not available. Skipping save.");
      setStatusMessage("User not logged in. Course not saved.");
      return;
    }
  
    const { data, error } = await supabase.from("courses").insert([
      {
        user_id: user.id,
        course_name: formData.course_name,
        difficulty: formData.difficulty,
        additional_info: formData.additional_info,
        sections,
        content,
        quiz,
      },
    ]);
  
    if (error) {
      console.error("Error saving course:", error);
      setStatusMessage("Error saving course.");
    } else {
      console.log("Saved course:", data);
      setStatusMessage("Course saved successfully.");
      fetchSavedCourses();
    }
  };
  

  const handleFormSubmit = (formData) => {
    setLoading(true);
    setError("");
    setStatusMessage("");
    console.log("formData is"+formData)
    fetch("https://103f-14-142-11-142.ngrok-free.app/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to generate content");
        return res.json();
      })
      .then((data) => {
        setSections(data.sections || []);
        setContent(data.content || {});
        setQuiz(data.quiz || {});
        setCurrentIndex(0);
        setLoading(false);

        if (user) {
          saveCourseToDB(formData, data.sections, data.content, data.quiz);
        } else {
          console.error("User is null. Skipping save.");
          setStatusMessage("User not logged in. Course not saved.");
        }
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        console.error("Error generating content:", error);
      });
  };

  const handleSelectCourse = (course) => {
    setSections(course.sections);
    setContent(course.content);
    setQuiz(course.quiz);
    setCurrentIndex(0);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Sidebar */}
      <div style={{ width: "250px", borderRight: "1px solid #ccc", padding: "10px", overflowY: "auto" }}>
        <h3>Saved Courses</h3>
        {savedCourses.length === 0 && <p>No courses yet</p>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {savedCourses.map((course) => (
            <li key={course.id} style={{ cursor: "pointer", marginBottom: "10px" }} onClick={() => handleSelectCourse(course)}>
              <strong>{course.course_name}</strong>
              <div style={{ fontSize: "12px", color: "#888" }}>{course.difficulty}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="content-gen-container" style={{ flex: 1, padding: "20px" }}>
        <h1>Course Content Generator</h1>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {statusMessage && <p style={{ color: "green" }}>{statusMessage}</p>}
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
