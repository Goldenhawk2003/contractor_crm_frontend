import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Quiz.css';

const BASE_URL = 'https://ecc-backend-31b43c38f51f.herokuapp.com';

const MAX_FILE_SIZE_MB = 10;

const QuizComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/questions/`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error('Error loading questions:', err));
  }, []);

  const handleChange = (questionId, field, value) => {
    if (field === 'image_answer' && value && value.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File too large. Max allowed is ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value,
        question: questionId,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('You must be logged in to submit the quiz.');
      return;
    }

    const formData = new FormData();

    Object.entries(answers).forEach(([id, data], idx) => {
      const { image_answer, ...rest } = data;
      formData.append('answers', JSON.stringify(rest));
      if (image_answer) {
        formData.append(`image_answer_${idx}`, image_answer);
      }
    });

    try {
      await axios.post(`${BASE_URL}/api/submit-answers/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      alert('Quiz submitted!');
    } catch (err) {
      console.error('❌ Error submitting:', err);
      alert('Submission failed. See console for details.');
    }
  };

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (!window.google || !questions.length) return;
  
    const currentQuestion = questions[currentIndex];
    if (currentQuestion?.question_type !== 'location') return;
  
    const input = document.getElementById('location-autocomplete');
    if (!input) return;
  
    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ['geocode'],
      componentRestrictions: { country: 'ca' }, // Optional: restrict to CA
    });
  
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const formatted = place.formatted_address;
      handleChange(currentQuestion.id, 'text_answer', formatted);
    });
  }, [questions, currentIndex]);

  return (
    <div className="quiz-container">
      <h1>Help Us, Help You!</h1>
      <h2>Answer the Quiz</h2>
      {questions.length > 0 && (
  <div className="quiz-progress" style={{ marginBottom: "1rem" }}>
    <p>
      Question {currentIndex + 1} of {questions.length}
    </p>
    <div
      style={{
        backgroundColor: "#e0e0e0",
        borderRadius: "8px",
        height: "10px",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${((currentIndex + 1) / questions.length) * 100}%`,
          backgroundColor: "#1b3656", // Use your blue color or update to match your palette
          height: "100%",
          transition: "width 0.3s ease-in-out",
        }}
      ></div>
    </div>
  </div>
)}
      <form onSubmit={handleSubmit}>
        {currentQuestion && (
          <div className="question-block" key={currentQuestion.id}>
            <label><strong>{currentQuestion.text}</strong></label>

            {currentQuestion.question_type === 'text' && (
              <input
                type="text"
                value={answers[currentQuestion.id]?.text_answer || ''}
                onChange={(e) =>
                  handleChange(currentQuestion.id, 'text_answer', e.target.value)
                }
              />
            )}

            {currentQuestion.question_type === 'text_image' && (
              <>
                <input
                  type="text"
                  placeholder="Your answer"
                  value={answers[currentQuestion.id]?.text_answer || ''}
                  onChange={(e) =>
                    handleChange(currentQuestion.id, 'text_answer', e.target.value)
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleChange(currentQuestion.id, 'image_answer', e.target.files[0])
                  }
                />
              </>
            )}

            {currentQuestion.question_type === 'datetime' && (
              <input
                type="datetime-local"
                value={answers[currentQuestion.id]?.text_answer || ''}
                onChange={(e) =>
                  handleChange(currentQuestion.id, 'text_answer', e.target.value)
                }
              />
            )}

            {currentQuestion.question_type === 'mcq' && (
              <select
                value={answers[currentQuestion.id]?.text_answer || ''}
                onChange={(e) =>
                  handleChange(currentQuestion.id, 'text_answer', e.target.value)
                }
              >
                <option value="">-- Select an option --</option>
                {currentQuestion.options.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
            {currentQuestion.question_type === 'location' && (
  <input
    id="location-autocomplete"
    type="text"
    placeholder="Enter location"
    value={answers[currentQuestion.id]?.text_answer || ''}
    onChange={(e) =>
      handleChange(currentQuestion.id, 'text_answer', e.target.value)
    }
    style={{
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      width: '100%',
      maxWidth: '400px'
    }}
  />
)}
          </div>
        )}


        <div className="quiz-nav-buttons" style={{ marginTop: '1rem' }}>
          {currentIndex > 0 && (
            <button type="button" onClick={() => setCurrentIndex((prev) => prev - 1)}>
              Previous
            </button>
          )}
          {currentIndex < questions.length - 1 && (
            <button type="button" onClick={() => setCurrentIndex((prev) => prev + 1)}>
              Next
            </button>
          )}
          {currentIndex === questions.length - 1 && (
            <button type="submit">Submit</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuizComponent;