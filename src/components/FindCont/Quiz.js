import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Quiz.css';

const BASE_URL = 'https://ecc-backend-31b43c38f51f.herokuapp.com';
const MAX_FILE_SIZE_MB = 10;

export const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");

  if (token) {
    console.log("✅ Using token for auth header:", token);
    return { Authorization: `Bearer ${token}` };
  }

  console.log("🚫 No token found. Sending request without auth.");
  return {};
};

const QuizComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation(); 
  const [hasPrefill, setHasPrefill] = useState(false);
  const [prefillData, setPrefillData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const headers = token
      ? {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
        
      : {
          'Content-Type': 'application/json',
        };
  
    axios
      .get(`${BASE_URL}/api/questions/`, { headers })
      .then((res) => {
        console.log("✅ Questions loaded:", res.data);
        setQuestions(res.data);
      })
      .catch((err) => {
        console.error("❌ Please Try Logging in:", err.response || err);
      });
      axios.interceptors.response.use(
        res => res,
        err => {
          if (err.response?.status === 401) {
            console.warn("❌ Invalid token. Clearing localStorage.");
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
          return Promise.reject(err);
        }
      );
  }, []);

  useEffect(() => {
    if (questions.length > 0 && location.state?.prefillAnswer && location.state?.questionType === 'text_image') {
      const questionId = questions[location.state.questionIndex]?.id;
      if (questionId) {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: {
            ...prev[questionId],  // Preserve existing data
            extra_info: location.state.prefillAnswer,  // Only set extra_info
            question: questionId,
          },
        }));
        setHasPrefill(true);  // Set the prefill flag
      }
    }
  }, [questions, location.state]);

  const isCurrentQuestionAnswered = () => {
  if (!currentQuestion) return false;

  const answer = answers[currentQuestion.id];

  switch (currentQuestion.question_type) {
    case 'text':
    case 'text_image':
    case 'datetime':
    case 'location':
      return !!(answer && answer.text_answer?.trim());
    
    case 'mcq':
      return !!(answer && answer.text_answer);

    case 'guest':
      return isLoggedIn || (
        answer?.name?.trim() &&
        answer?.email?.trim() &&
        answer?.phone?.trim()
      );

    default:
      return false;
  }
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
  const handleChangeGuest = (questionId, field, value) => {
    setAnswers((prev) => {
      // Get the existing guest info if available, otherwise set empty strings
      const existingGuestInfo = prev[questionId] || {};
      const name = field === 'name' ? value : existingGuestInfo.name || '';
      const email = field === 'email' ? value : existingGuestInfo.email || '';
      const phone = field === 'phone' ? value : existingGuestInfo.phone || '';
  
      // Create the combined text answer
      const combinedText = `Name: ${name}, Email: ${email}, Phone: ${phone}`;
  
      // Update the state with the new combined answer
      return {
        ...prev,
        [questionId]: {
          ...existingGuestInfo,
          [field]: value,
          question: questionId,
          text_answer: combinedText,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    Object.entries(answers).forEach(([id, data], idx) => {
      const { image_answer, text_answer, extra_info, ...rest } = data;
      let combinedAnswer = text_answer || "";
      
      // Combine user input and prefill if both exist
      if (extra_info) {
        combinedAnswer = `${text_answer || ""} - ${extra_info}`;
      }
  
      // Append the combined answer to the formData
      formData.append('answers', JSON.stringify({ ...rest, text_answer: combinedAnswer }));
  
      // Append image if it exists
      if (image_answer) {
        formData.append(`image_answer_${idx}`, image_answer);
      }
    });
  
    // Retrieve the token from local storage
    const token = localStorage.getItem('access_token');
    const headers = { 'Content-Type': 'multipart/form-data' };
    
    // Add the Authorization header if the token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    try {
      await axios.post(`${BASE_URL}/api/submit-answers/`, formData, {
        headers,
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

  useEffect(() => {
      // Add a class to the body for this specific page
      document.body.classList.add("specific-page-quiz");
  
      // Clean up by removing the class when the component is unmounted
      return () => {
        document.body.classList.remove("specific-page-quiz");
      };
    }, []);
    useEffect(() => {
      console.log('User logged in:', isLoggedIn);
      console.log('Questions:', questions);
    }, [isLoggedIn, questions]);
  return (
    <div className="quiz-wrapper">
      <div className="quiz-hero">
        <h1 className='quiz-page-header'>Help Us, Help You!</h1>
        <p className='quiz-page-subheader'>Our custom questionnaire is designed to match you with the best contractor for each of your projects.</p>
       
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
                  required
                />
              )}

{currentQuestion.question_type === 'text_image' && (
    <div className="quiz-input-wrapper">
  <>
    <input
      type="text"
      placeholder="Your answer"
      className="quiz-input"
      value={answers[currentQuestion.id]?.text_answer || ''}
      onChange={(e) => handleChange(currentQuestion.id, 'text_answer', e.target.value)}
      required
    />
    <input
      type="file"
      accept="image/*"
      className="quiz-file"
      onChange={(e) => handleChange(currentQuestion.id, 'image_answer', e.target.files[0])}
    />
    {hasPrefill && currentQuestion.id === questions[location.state?.questionIndex]?.id && (
      <input
        type="text"
        placeholder="Additional info (prefilled)"
        className="quiz-input"
        value={answers[currentQuestion.id]?.extra_info || ''}
        onChange={(e) => handleChange(currentQuestion.id, 'extra_info', e.target.value)}
      />
    )}
  </>
  </div>
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
      <option value="Next Week">This Month</option>
      <option value="Whenever">No Specific Date</option>
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
                  <div className="quiz-input-wrapper">
                <input
                  id="location-autocomplete"
                  type="text"
                  placeholder="Enter location"
                  className="quiz-input"
                  value={answers[currentQuestion.id]?.text_answer || ''}
                  onChange={(e) => handleChange(currentQuestion.id, 'text_answer', e.target.value)}
                />
                </div>
              )}
            </div>
          )}

          
{currentQuestion && currentQuestion.question_type === 'guest' && !isLoggedIn && (
  <div className="guest-info">
    <label className="question-label">
      <strong>Tell us a bit about yourself:</strong>
    </label>
    <input
      type="text"
      placeholder="Your Name"
      className="quiz-input"
      value={answers[currentQuestion.id]?.name || ''}
      onChange={(e) => handleChangeGuest(currentQuestion.id, 'name', e.target.value)}
    />
    <input
      type="email"
      placeholder="Your Email"
      className="quiz-input"
      value={answers[currentQuestion.id]?.email || ''}
      onChange={(e) => handleChangeGuest(currentQuestion.id, 'email', e.target.value)}
    />
    <input
      type="tel"
      placeholder="Your Phone Number"
      className="quiz-input"
      value={answers[currentQuestion.id]?.phone || ''}
      onChange={(e) => handleChangeGuest(currentQuestion.id, 'phone', e.target.value)}
    />
  </div>
)}
          

          <div className="quiz-nav-buttons">
            {currentIndex > 0 && (
              <button type="button" className="quiz-button" onClick={() => setCurrentIndex((prev) => prev - 1)}>
                Previous
              </button>
            )}
         {currentIndex < questions.length - 1 && (
  <button
    type="button"
    className="quiz-button"
    onClick={() => setCurrentIndex((prev) => prev + 1)}
    disabled={!isCurrentQuestionAnswered()}
  >
    Next
  </button>
)}
            {currentIndex === questions.length - 1 && (
              <button type="submit" className="quiz-button submit">
                Submit
              </button>
            )}
        
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizComponent;