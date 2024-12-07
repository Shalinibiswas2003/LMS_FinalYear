const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data

// Routes
app.post("/generate", (req, res) => {
  const { course_name, difficulty, additional_info } = req.body;

  // Mocked AI-generated response
  const response = {
    sections: ["Introduction", "Intermediate Topics", "Advanced Topics"],
    content: {
      title: `Course: ${course_name}`,
      body: `This is a ${difficulty}-level course. Additional notes: ${additional_info}`,
    },
    quiz: {
      questions: [
        { question: "What is Node.js?", options: ["Option 1", "Option 2"], answer: "Option 1" },
        { question: "What is Express?", options: ["Option A", "Option B"], answer: "Option A" },
      ],
    },
  };

  res.status(200).json(response);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
