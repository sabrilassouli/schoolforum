import React, { useEffect, useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./../css/courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [topQuestions, setTopQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/courses");
        setCourses(response.data);
      } catch (error) {
        setError("Failed to fetch courses");
      }
    };

    fetchCourses();
  }, []);

  // Fetch top 5 questions by views
  useEffect(() => {
    const fetchTopQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/questions/popular"
        );
        setTopQuestions(response.data); // Fetch from the new API endpoint
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        setError("Failed to fetch top questions");
        setLoading(false);
      }
    };

    fetchTopQuestions();
  }, []);

  if (error) {
    return <div className="error-message"> {error} </div>;
  }

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="main-container">
      {/* Left Sidebar: Courses */}
      <div className="courses-container">
        <h1 className="courses-title">Courses</h1>
        <ul className="courses-list">
          {courses.map((course) => (
            <li key={course.id} className="course-item">
              <button
                className="course-button"
                onClick={() => handleCourseClick(course.id)}
              >
                {course.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Middle Section: Top Questions */}
      <div className="top-questions-container">
        <h2>popular questions</h2>
        {loading ? (
          <p>Loading popular questions...</p>
        ) : (
          <ul className="questions-list">
            {topQuestions.map((question) => (
              <li key={question.id} className="question-item">
                <strong>{question.title}</strong>
                <p>{question.description}</p>
                <div className="question-details">
                  <p>Views: {question.views}</p>
                  <p>Comments: {question.comments}</p>
                  <p>Upvotes: {question.upvotes}</p>
                  <Link to={`/questions/${question.id}`}>View Details</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Courses;
