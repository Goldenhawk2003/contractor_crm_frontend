import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Quiz.css';

const BASE_URL = 'https://ecc-backend-31b43c38f51f.herokuapp.com';
const MAX_FILE_SIZE_MB = 10;

const QuizComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const headers = {};
  
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    axios.get(`${BASE_URL}/api/questions/`, { headers })
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error('Error loading questions:', err));
  }, []);

  const handleGuestChange = (field, value) => {
    setGuestInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
  
    const formData = new FormData();
    Object.entries(answers).forEach(([id, data], idx) => {
      const { image_answer, ...rest } = data;
      formData.append('answers', JSON.stringify(rest));
      if (image_answer) {
        formData.append(`image_answer_${idx}`, image_answer);
      }
    });
  
    // Include guest information if not logged in
    if (!isLoggedIn) {
      formData.append('guest_name', guestInfo.name);
      formData.append('guest_email', guestInfo.email);
      formData.append('guest_phone', guestInfo.phone);
    }
  
    try {
      await axios.post(`${BASE_URL}/api/submit-answers/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(localStorage.getItem('access_token') && {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          }),
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
      componentRestrictions: { country: 'ca' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const formatted = place.formatted_address;
      handleChange(currentQuestion.id, 'text_answer', formatted);
    });
  }, [questions, currentIndex]);

  return (
    <div className="quiz-wrapper">
      <div className="quiz-hero">
        <h1 className='quiz-page-header'>Help Us, Help You!</h1>
        <p className='quiz-page-subheader'>Our custom quiz is designed to help match you with the best results for your needs.</p>
       
      </div>
      {currentQuestion && (
  <div className="question-block-outer" key={currentQuestion.id}>
    <label className="question-label">
      <strong>{currentQuestion.text}</strong>
    </label>

    {/* Your question input rendering (e.g., MCQ, text input, etc.) goes here */}

  </div>
)}
      <div className="quiz-container">
      {questions.length > 0 && (
  <div className="quiz-progress-circles">
    <p>Question {currentIndex + 1} of {questions.length}</p>
    <div className="circle-container">
      {questions.map((_, idx) => (
        <div
          key={idx}
          className={`progress-circle ${idx === currentIndex ? 'active' : ''} ${idx < currentIndex ? 'completed' : ''}`}
        />
      ))}
    </div>
  </div>
)}

        <form onSubmit={handleSubmit} className="quiz-form">
          {currentQuestion && (
            <div className="question-block" key={currentQuestion.id}>
             

              {currentQuestion.question_type === 'text' && (
                <input
                  type="text"
                  className="quiz-input"
                  value={answers[currentQuestion.id]?.text_answer || ''}
                  onChange={(e) => handleChange(currentQuestion.id, 'text_answer', e.target.value)}
                />
              )}

              {currentQuestion.question_type === 'text_image' && (
                <>
                  <input
                    type="text"
                    placeholder="Your answer"
                    className="quiz-input"
                    value={answers[currentQuestion.id]?.text_answer || ''}
                    onChange={(e) => handleChange(currentQuestion.id, 'text_answer', e.target.value)}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="quiz-file"
                    onChange={(e) => handleChange(currentQuestion.id, 'image_answer', e.target.files[0])}
                  />
                </>
              )}

              {currentQuestion.question_type === 'datetime' && (
                <div className="quiz-input-group">
                  <label>Select Date/Time:</label>
                  <input
                    type="datetime-local"
                    className="quiz-input"
                    value={answers[currentQuestion.id]?.text_answer || ''}
                    onChange={(e) => handleChange(currentQuestion.id, 'text_answer', e.target.value)}
                    />
                    <label>Or Choose an Option:</label>
                    <select
                      className="quiz-input"
                      value={answers[currentQuestion.id]?.text_answer || ''}
                      onChange={(e) => handleChange(currentQuestion.id, 'text_answer', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="ASAP">ASAP</option>
                      <option value="Next Week">Next Week</option>
                      <option value="Whenever">Whenever</option>
                    </select>
                  </div>
                )}

                {currentQuestion.question_type === 'mcq' && (
                  <div className="quiz-mcq">
                    {currentQuestion.options.map((opt, idx) => (
                      <label key={idx} className="quiz-option">
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={opt}
                          checked={answers[currentQuestion.id]?.text_answer === opt}
                          onChange={(e) => handleChange(currentQuestion.id, 'text_answer', e.target.value)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestion.question_type === 'location' && (
                  <input
                    id="location-autocomplete"
                    type="text"
                    placeholder="Enter location"
                    className="quiz-input"
                    value={answers[currentQuestion.id]?.text_answer || ''}
                    onChange={(e) => handleChange(currentQuestion.id, 'text_answer', e.target.value)}
                  />
                )}
              </div>
            )}
            

            <div className="quiz-nav-buttons">
              {currentIndex > 0 && (
                <button type="button" className="quiz-button" onClick={() => setCurrentIndex((prev) => prev - 1)}>
                  Previous
                </button>
              )}
              {currentIndex < questions.length - 1 && (
                <button type="button" className="quiz-button" onClick={() => setCurrentIndex((prev) => prev + 1)}>
                  Next
                </button>
              )}
              {currentIndex === questions.length - 1 && (
                <button type="submit" className="quiz-button submit">
                  Submit
                </button>
              )}
           {!isLoggedIn && (
  <div className="guest-info">
    <label className="question-label">
      <strong>Tell us a bit about yourself:</strong>
    </label>
    <input
      type="text"
      placeholder="Your Name"
      className="quiz-input"
      value={guestInfo.name}
      onChange={(e) => handleGuestChange('name', e.target.value)}
    />
    <input
      type="email"
      placeholder="Your Email"
      className="quiz-input"
      value={guestInfo.email}
      onChange={(e) => handleGuestChange('email', e.target.value)}
    />
    <input
      type="tel"
      placeholder="Your Phone Number"
      className="quiz-input"
      value={guestInfo.phone}
      onChange={(e) => handleGuestChange('phone', e.target.value)}
    />
  </div>
)}
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizComponent;