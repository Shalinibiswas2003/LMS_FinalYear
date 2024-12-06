import React, { useState } from "react";
 // Optional: Separate CSS for form styling

const Form = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    course_name: "",
    difficulty: "",
    additional_info: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("course_name", formData.course_name);
    data.append("difficulty", formData.difficulty);
    data.append("additional_info", formData.additional_info);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div>
        <label htmlFor="course_name">Course Name:</label>
        <input
          type="text"
          id="course_name"
          name="course_name"
          value={formData.course_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="difficulty">Difficulty:</label>
        <input
          type="text"
          id="difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="additional_info">Additional Notes:</label>
        <textarea
          id="additional_info"
          name="additional_info"
          value={formData.additional_info}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Generate</button>
    </form>
  );
};

export default Form;
