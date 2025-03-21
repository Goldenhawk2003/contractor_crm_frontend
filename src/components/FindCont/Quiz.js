import React, { useState, useEffect } from "react";
import "./Quiz.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Helper: Get token-based auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Fetch quiz questions using the environment variable and token headers
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/quiz/questions/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestions(data.questions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Handle response changes for each question
  const handleChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit all responses using token-based authentication
 // Submit all responses using token-based authentication
 const handleSubmit = async () => {
  setSubmitting(true);
  setError(null);

  try {
    for (const [questionId, answerObj] of Object.entries(responses)) {
      const question = questions.find((q) => q.id === parseInt(questionId));
      let formData = new FormData();

      formData.append("quiz_id", questionId);

      if (question.question_type === "text") {
        formData.append("answer", answerObj);
      } else if (question.question_type === "multiple_choice") {
        formData.append("selected_choice", answerObj);
      } else if (question.question_type === "date") {
        formData.append("answer_date", new Date(answerObj).toISOString());
      } else if (question.question_type === "text_with_image") {
        formData.append("answer", answerObj.text || "");
        if (answerObj.image) {
          formData.append("image", answerObj.image);
        }
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/quiz/submit/`,
        {
          method: "POST",
          headers: getAuthHeaders(), // No Content-Type here
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit response");
      }
    }

    setSubmitted(true);
    alert("Thank you! Your responses have been submitted.");
  } catch (err) {
    setError(err.message);
  } finally {
    setSubmitting(false);
  }
};
  if (loading) return <p className="loading-message">Loading questions...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>Help Us Help You</h1>
        <p>
          Our custom quiz is designed to help you find the best match for your
          needs.
        </p>
      </div>
      {submitted && (
        <p className="success-message">
          Your responses have been submitted! We will contact in the next 24 hours to connect you with one of our specialists Thank you!
        </p>
      )}
      <div key={currentQuestion.id} className="quiz-question-container">
        <div className="quiz-question">
          <h2>{currentQuestion.question}</h2>
          {currentQuestion.description && <p>{currentQuestion.description}</p>}
        </div>
        <div className="quiz-options">
          {currentQuestion.question_type === "text" && (
            <textarea
              placeholder="Type your answer here..."
              rows="4"
              value={responses[currentQuestion.id] || ""}
              onChange={(e) =>
                handleChange(currentQuestion.id, e.target.value)
              }
              className="quiz-textarea"
            />
          )}
          {currentQuestion.question_type === "multiple_choice" &&
            currentQuestion.choices &&
            currentQuestion.choices.map((choice, index) => (
              <div key={index} className="quiz-choice">
                <input
                  type="radio"
                  id={`choice-${index}-${currentQuestion.id}`}
                  name={`question-${currentQuestion.id}`}
                  value={choice}
                  checked={responses[currentQuestion.id] === choice}
                  onChange={(e) =>
                    handleChange(currentQuestion.id, e.target.value)
                  }
                />
                <label htmlFor={`choice-${index}-${currentQuestion.id}`}>
                  {choice}
                </label>
              </div>
            ))}
            {currentQuestion.question_type === "date" && (
  <DatePicker
    selected={responses[currentQuestion.id] || null}
    onChange={(date) => handleChange(currentQuestion.id, date)}
    showTimeSelect
    dateFormat="Pp"
    placeholderText="Select a date and time"
    className="quiz-datepicker"
  />
)}
{currentQuestion.question_type === "text_with_image" && (
  <div className="quiz-text-image">
    <textarea
      placeholder="Type your answer here..."
      rows="4"
      value={responses[currentQuestion.id]?.text || ""}
      onChange={(e) =>
        handleChange(currentQuestion.id, {
          ...responses[currentQuestion.id],
          text: e.target.value,
        })
      }
      className="quiz-textarea"
    />
    <p>Upload an image (optional)</p>
    <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    if (e.target.files.length > 0) {
      handleChange(currentQuestion.id, {
        ...responses[currentQuestion.id],
        image: e.target.files[0],  // Ensure the file is stored
      });
    }
  }}
/>
  </div>
)}
        </div>
      </div>
      <div className="quiz-navigation">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="submit-btn"
        >
          Previous
        </button>
        {currentQuestionIndex < questions.length - 1 ? (
          <button onClick={handleNext} className="submit-btn">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting} className="submit-btn">
            {submitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
     
    </div>
  );
};

export default Quiz;