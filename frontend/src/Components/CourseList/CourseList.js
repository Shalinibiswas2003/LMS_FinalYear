import React from 'react';

const CourseList = ({ courses }) => {
  if (!courses.length) {
    return <p className="text-gray-600">No courses generated yet.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mt-4 mb-2">Your Courses</h2>
      <ul className="list-disc list-inside space-y-1">
        {courses.map(course => (
          <li key={course.id}>
            <span className="font-medium">{course.course_name}</span>
            <span className="text-gray-500 text-sm ml-2">
              ({new Date(course.created_at).toLocaleDateString()})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
