import React, { useState } from "react";

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
    // Send the data as JSON instead of FormData
    console.log("Form Data Submitted:", formData);  // For debugging purpose
    onSubmit(formData);  // Passing the form data as JSON
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
       <select
  id="difficulty"
  name="difficulty"
  value={formData.difficulty}
  onChange={handleChange}
  required
>
  <option value="">Select Difficulty</option>
  <option value="easy">Easy</option>
  <option value="medium">Medium</option>
  <option value="hard">Hard</option>
</select>

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
