import "./Quiz.css";
import React, { useState } from 'react';
import axios from 'axios';

const QuizComponent = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "What's your name?",
      question_type: "text",
    },
    {
      id: 2,
      text: "Upload an image and explain it",
      question_type: "text_image",
    },
    {
      id: 3,
      text: "Pick a date and time",
      question_type: "datetime",
    },
    {
      id: 4,
      text: "What's your favorite color?",
      question_type: "mcq",
      options: ["Red", "Blue", "Green", "Yellow"],
    },
  ]);

  const [answers, setAnswers] = useState({});

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

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.entries(answers).forEach(([key, value], idx) => {
      const { image_answer, ...textData } = value;
      formData.append('answers', JSON.stringify(textData));
      if (image_answer) {
        formData.append(`image_answer_${idx}`, image_answer);
      }
    });

    try {
      const response = await axios.post('/api/submit-answers/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Submitted successfully!');
      console.log(response.data);
    } catch (err) {
      console.error('Error submitting:', err);
      alert('Submission failed.');
    }
  };

  return (
    <div className="quiz-container">
      <h2>Quiz</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {questions.map((q) => (
          <div key={q.id} className="question-block">
            <label>{q.text}</label>

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

        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
};

export default QuizComponent;