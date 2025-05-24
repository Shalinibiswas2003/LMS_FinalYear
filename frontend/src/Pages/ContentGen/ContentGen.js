import React, { useState, useEffect } from "react";
import Form from "../../Components/Form/Form";
import ContentDisplay from "../../Components/ContentDisplay/ContentDisplay";
import { supabase } from "../../supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import "./ContentGen.css";
import spinner from "../../Assets/spinner.gif";
import Navbar from "../../Components/Navbar/Navbar";;

const ContentGen = () => {
  const user = useUser();
  const [savedCourses, setSavedCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [content, setContent] = useState({});
  const [quiz, setQuiz] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [generatedTest, setGeneratedTest] = useState(null);

  const showTemporaryStatus = (message, duration = 3000) => {
    setStatusMessage(message);
    setTimeout(() => {
      setStatusMessage("");
    }, duration);
  };

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
      showTemporaryStatus("User not logged in. Course not saved.");
      return;
    }

    const { data, error } = await supabase
      .from("courses")
      .insert([
        {
          user_id: user.id,
          course_name: formData.course_name,
          difficulty: formData.difficulty,
          additional_info: formData.additional_info,
          sections,
          content,
          quiz,
        },
      ])
      .select();

    if (error) {
      console.error("Error saving course:", error);
      showTemporaryStatus("Error saving course.");
    } else {
      if (data && data.length > 0) {
        setCurrentCourseId(data[0].id); // Set new course ID
      }
      console.log("Saved course:", data);
      showTemporaryStatus("Course saved successfully.");
      fetchSavedCourses();
    }
  };

  const deleteCourse = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId);

    if (error) {
      console.error("Error deleting course:", error);
      showTemporaryStatus("Failed to delete course.");
    } else {
      showTemporaryStatus("Course deleted successfully.");
      fetchSavedCourses();
    }
  };

  const handleFormSubmit = (formData) => {
    setLoading(true);
    setError("");
    setStatusMessage("");

    fetch("http://127.0.0.1:5001/generate", {
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
          showTemporaryStatus("User not logged in. Course not saved.");
        }
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        console.error("Error generating content:", error);
      });
  };

  const handleTakeTest = async () => {
    setLoading(true); // Start loading spinner
    setError(""); // Clear previous errors
  
    try {
      const res = await fetch(
        "https://mostly-communal-fly.ngrok-free.app/generate-test",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course_name: savedCourses[0]?.course_name || "Default Course",
            difficulty: savedCourses[0]?.difficulty || "medium",
            content: content,
          }),
        }
      );
  
      if (!res.ok) throw new Error("Failed to generate test");

      const data = await res.json();
      setGeneratedTest(data.test);

      localStorage.setItem("testData", data.test);
  
      setLoading(false); // Stop spinner before redirect
      window.location.href = "/test"; // Redirect
    } catch (err) {
      console.error("Error generating test:", err);
      setError("Failed to generate test.");
      setLoading(false);
    }
  };

  const handleSelectCourse = (course) => {
    setSections(course.sections);
    setContent(course.content);
    setQuiz(course.quiz);
    setCurrentIndex(0);
    setCurrentCourseId(course.id); // Add this line
  };

  return (
    <>
      <Navbar />
      {statusMessage && <p style={{ color: "green" }}>{statusMessage}</p>}

      {loading && (
        <div className="spinner-overlay">
          <img src={spinner} alt="Loading..." className="spinner" />
        </div>
      )}

      <div style={{ display: "flex", height: "100vh", position: "relative", top: "7rem" }}>
        {/* Sidebar */}
        <div
          style={{
            width: isSidebarOpen ? "250px" : "40px",
            borderRight: "1px solid #ccc",
            padding: "10px",
            overflowY: "auto",
            transition: "width 0.3s",
            position: "relative",
          }}
        >
          <button
            onClick={toggleSidebar}
            style={{
              position: "absolute",
              top: "10px",
              right: isSidebarOpen ? "-15px" : "-15px",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
              zIndex: 1,
            }}
            title={isSidebarOpen ? "Collapse" : "Expand"}
          >
            {isSidebarOpen ? "«" : "»"}
          </button>

          {isSidebarOpen && (
            <>
              <h3>Saved Courses</h3>
              {savedCourses.length === 0 && <p>No courses yet</p>}
              <ul style={{ listStyle: "none", padding: 0 }}>
                {savedCourses.map((course) => (
                  <li
                    key={course.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{ cursor: "pointer", flexGrow: 1 }}
                      onClick={() => handleSelectCourse(course)}
                    >
                      <strong>{course.course_name}</strong>
                      <div style={{ fontSize: "12px", color: "#888" }}>
                        {course.difficulty}
                      </div>
                    </div>
                    <span
                      style={{
                        marginLeft: "10px",
                        color: "red",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      title="Delete Course"
                      onClick={() => deleteCourse(course.id)}
                    >
                      ×
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="content-gen-container" style={{ flex: 1, padding: "20px" }}>
          <h1>Course Content Generator</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}

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

          {sections.length > 0 && (
            <button onClick={handleTakeTest} className="take-test-button">
              Take Test
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ContentGen;
