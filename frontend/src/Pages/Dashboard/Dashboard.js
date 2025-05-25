import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import UserCard from '../../Components/UserCard/UserCard';
import LogoutButton from '../../Components/LogoutButton/LogoutButton';
import CourseList from '../../Components/CourseList/CourseList';

const CACHE_KEY = 'recommendedCoursesWithCourses';
const CACHE_EXPIRY_MS = 1000 * 60 * 60; // 1 hour cache duration

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndCourses = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        navigate('/Login');
        return;
      }

      setUser(data.user);

      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, course_name, created_at')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false });

      if (!courseError) {
        setCourses(courseData);

        // Try to read cached data from localStorage
        const cachedStr = localStorage.getItem(CACHE_KEY);
        if (cachedStr) {
          try {
            const cached = JSON.parse(cachedStr);

            // Check cache expiry and compare cached courses with current courses
            const isCacheValid =
              Date.now() - cached.timestamp < CACHE_EXPIRY_MS &&
              JSON.stringify(cached.courses) === JSON.stringify(courseData);

            if (isCacheValid) {
              setRecommended(cached.recommendations);
              setLoading(false);
              return; // Use cached recommendations
            }
          } catch {
            // If JSON parsing fails, ignore cache and fetch fresh
          }
        }

        // Cache is missing/expired or courses changed, fetch fresh recommendations
        const courseNames = courseData.slice(0, 3).map(course => course.course_name);
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/recommend-courses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ course_names: courseNames })
        });

        const result = await res.json();
        if (res.ok) {
          setRecommended(result.recommendations);

          // Cache the recommendations along with the current courses and timestamp
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              recommendations: result.recommendations,
              courses: courseData,
              timestamp: Date.now()
            })
          );
        } else {
          console.error(result.error);
        }
      }

      setLoading(false);
    };

    fetchUserAndCourses();
  }, [navigate]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <UserCard user={user} />
      <CourseList courses={courses} />
      {recommended.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-4">Recommended Courses</h2>
          <ul className="list-disc list-inside text-gray-700">
            {recommended.map((item, index) => (
              <li key={index}>
                <span className="font-medium">{item.course_name}</span> — {item.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
      <LogoutButton />
    </div>
  );
};

export default Dashboard;
