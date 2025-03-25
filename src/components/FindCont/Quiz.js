import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'https://ecc-backend-31b43c38f51f.herokuapp.com';

const QuizComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    axios.get(`${BASE_URL}/api/questions/`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error('Error loading questions:', err));
  }, []);

  const handleChange = (questionId, field, value) => {
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
  
    const token = localStorage.getItem('access_token'); // ✅ Correct token key
  
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
        withCredentials: true, // Optional: include if backend expects it
      });
      alert('Quiz submitted!');
    } catch (err) {
      console.error('❌ Error submitting:', err);
      alert('Submission failed. See console for details.');
    }
  };

  return (
    <div className="quiz-container">
      <h2>Answer the Quiz</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q.id} className="question-block">
            <label><strong>{q.text}</strong></label>

            {q.question_type === 'text' && (
              <input
                type="text"
                onChange={(e) =>
                  handleChange(q.id, 'text_answer', e.target.value)
                }
              />
            )}

            {q.question_type === 'text_image' && (
              <>
                <input
                  type="text"
                  placeholder="Your answer"
                  onChange={(e) =>
                    handleChange(q.id, 'text_answer', e.target.value)
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleChange(q.id, 'image_answer', e.target.files[0])
                  }
                />
              </>
            )}

            {q.question_type === 'datetime' && (
              <input
                type="datetime-local"
                onChange={(e) =>
                  handleChange(q.id, 'text_answer', e.target.value)
                }
              />
            )}

            {q.question_type === 'mcq' && (
              <select
                onChange={(e) =>
                  handleChange(q.id, 'text_answer', e.target.value)
                }
              >
                <option value="">-- Select an option --</option>
                {q.options.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default QuizComponent;