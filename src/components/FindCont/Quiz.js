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

  // Fetch quiz questions using token
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/quiz/questions/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await res.json();
        setQuestions(data.questions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Handle changes for each question
  const handleChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
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

  // Submit all responses
  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // Loop each question response
      for (const [questionId, answerObj] of Object.entries(responses)) {
        // Find question type from your questions array
        const question = questions.find((q) => q.id === parseInt(questionId, 10));
        if (!question) continue;

        // Build FormData
        const formData = new FormData();
        formData.append("quiz", questionId); // The field name "quiz" matches your FormResponseSerializer

        // Distinguish question types
        if (question.question_type === "text_with_image") {
          // text + image
          if (answerObj.text) {
            formData.append("answer", answerObj.text);
          }
          if (answerObj.image && answerObj.image instanceof File) {
            formData.append("answer_image", answerObj.image); 
          }
        } else if (question.question_type === "image") {
          // image only
          if (answerObj instanceof File) {
            formData.append("answer_image", answerObj);
          }
        } else {
          // text, multiple_choice, date, etc.
          formData.append("answer", answerObj || "");
        }

        // Submit to your quiz submit endpoint
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/quiz/submit/`,
          {
            method: "POST",
            headers: { ...getAuthHeaders() }, // No 'Content-Type' => let browser handle multipart
            body: formData,
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to submit response");
        }
      }
      // All done
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
        <p>Our custom quiz helps match your needs precisely.</p>
      </div>
      {submitted && <p className="success-message">Responses submitted. Thanks!</p>}

      <div key={currentQuestion.id} className="quiz-question-container">
        <div className="quiz-question">
          <h2>{currentQuestion.question}</h2>
          {currentQuestion.description && <p>{currentQuestion.description}</p>}
        </div>
        <div className="quiz-options">
          {/* text */}
          {currentQuestion.question_type === "text" && (
            <textarea
              placeholder="Type your answer here..."
              rows="4"
              value={responses[currentQuestion.id] || ""}
              onChange={(e) => handleChange(currentQuestion.id, e.target.value)}
              className="quiz-textarea"
            />
          )}
          {/* multiple_choice */}
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
                  onChange={(e) => handleChange(currentQuestion.id, e.target.value)}
                />
                <label htmlFor={`choice-${index}-${currentQuestion.id}`}>{choice}</label>
              </div>
            ))}

          {/* date (with time) */}
          {currentQuestion.question_type === "date" && (
            <DatePicker
              selected={responses[currentQuestion.id] || null}
              onChange={(date) => handleChange(currentQuestion.id, date)}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="Select date/time"
              className="quiz-datepicker"
            />
          )}
          {/* text_with_image */}
          {currentQuestion.question_type === "text_with_image" && (
            <div className="quiz-text-image">
              <textarea
                placeholder="Type your answer here..."
                rows="4"
                value={responses[currentQuestion.id]?.text || ""}
                onChange={(e) =>
                  handleChange(currentQuestion.id, {
                    ...(responses[currentQuestion.id] || {}),
                    text: e.target.value,
                  })
                }
                className="quiz-textarea"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleChange(currentQuestion.id, {
                    ...(responses[currentQuestion.id] || {}),
                    image: e.target.files[0],
                  })
                }
                className="quiz-file-upload"
              />
            </div>
          )}
          {/* image only */}
          {currentQuestion.question_type === "image" && (
            <div className="quiz-image-upload">
              <p>Upload an image</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleChange(currentQuestion.id, e.target.files[0])}
                className="quiz-file-upload"
              />
            </div>
          )}
        </div>
      </div>

      <div className="quiz-navigation">
        <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="submit-btn">
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