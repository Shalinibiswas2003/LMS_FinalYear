import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import UserCard from "../../Components/UserCard/UserCard";
import LogoutButton from "../../Components/LogoutButton/LogoutButton";
import "./Dashboard.css";
import Navbar from "../../Components/Navbar/Navbar";

const CACHE_KEY = "recommendedCoursesWithCourses";
const CACHE_EXPIRY_MS = 1000 * 60 * 60;
const IMAGE_CACHE_KEY = "courseImageCache";
const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [imageCache, setImageCache] = useState({});
  const [courseImages, setCourseImages] = useState({});
  const [recommendedImages, setRecommendedImages] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const cachedImages = localStorage.getItem(IMAGE_CACHE_KEY);
    if (cachedImages) {
      try {
        setImageCache(JSON.parse(cachedImages));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const fetchUserAndCourses = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        navigate("/Login");
        return;
      }

      setUser(data.user);

      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("id, course_name, created_at")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false });

      if (!courseError) {
        setCourses(courseData);

        const cachedStr = localStorage.getItem(CACHE_KEY);
        if (cachedStr) {
          try {
            const cached = JSON.parse(cachedStr);
            const isCacheValid =
              Date.now() - cached.timestamp < CACHE_EXPIRY_MS &&
              JSON.stringify(cached.courses) === JSON.stringify(courseData);

            if (isCacheValid) {
              setRecommended(cached.recommendations);
              setLoading(false);
              return;
            }
          } catch {}
        }

        const courseNames = courseData.slice(0, 3).map((c) => c.course_name);
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/recommend-courses`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ course_names: courseNames }),
          }
        );

        const result = await res.json();
        if (res.ok) {
          setRecommended(result.recommendations);
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              recommendations: result.recommendations,
              courses: courseData,
              timestamp: Date.now(),
            })
          );
        }
      }

      setLoading(false);
    };

    fetchUserAndCourses();
  }, [navigate]);

  const fetchUnsplashImage = async (keyword) => {
    if (imageCache[keyword]) return imageCache[keyword];

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          keyword
        )}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      const imageUrl = data.results?.[0]?.urls?.small;

      if (imageUrl) {
        const updatedCache = { ...imageCache, [keyword]: imageUrl };
        setImageCache(updatedCache);
        localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(updatedCache));
        return imageUrl;
      }
    } catch (err) {
      console.error("Unsplash fetch error:", err);
    }

    return "/placeholder.png";
  };

  useEffect(() => {
    const loadCourseImages = async () => {
      const images = {};
      for (const course of courses) {
        images[course.course_name] = await fetchUnsplashImage(
          course.course_name
        );
      }
      setCourseImages(images);
    };
    if (courses.length) loadCourseImages();
  }, [courses]);

  useEffect(() => {
    const loadRecommendedImages = async () => {
      const images = {};
      for (const rec of recommended) {
        images[rec.course_name] = await fetchUnsplashImage(rec.course_name);
      }
      setRecommendedImages(images);
    };
    if (recommended.length) loadRecommendedImages();
  }, [recommended]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
    <Navbar/>
    <div className="dashboard-container">
      <h1 className="welcome-message">
        Welcome back, {user?.user_metadata?.full_name || "User"}!
      </h1>
      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{courses.length}</div>
          <div className="stat-label">Your Courses</div>
        </div>
      </div>
      <UserCard user={user} />
      <h2 className="section-title">Your Generated Courses</h2>
      <div className="course-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <img
              src={courseImages[course.course_name] || "/placeholder.png"}
              alt={course.course_name}
              className="course-image"
            />
            <div className="course-info">
              <h3>{course.course_name}</h3>
            </div>
          </div>
        ))}
      </div>

      {recommended.length > 0 && (
        <>
          <h2 className="section-title">Recommended Courses</h2>
          <div className="course-grid">
            {recommended.map((item, index) => (
              <div key={index} className="course-card">
                <img
                  src={
                    recommendedImages[item.course_name] || "/placeholder.png"
                  }
                  alt={item.course_name}
                  className="course-image"
                />
                <div className="course-info">
                  <h3>{item.course_name}</h3>
                  <p>{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="logout-button-container">
  <LogoutButton />
</div>
    </div>
    </>
  );
};

export default Dashboard;
