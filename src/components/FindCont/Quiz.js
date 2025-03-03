import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/quiz/questions/');
                if (!response.ok) {
                    throw new Error('Failed to fetch questions');
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

    const handleSubmit = async () => {
        if (!responses[questions[currentQuestionIndex].id]) {
            alert('Please answer the question before submitting.');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            for (const questionId of Object.keys(responses)) {
                const response = await fetch('http://localhost:8000/api/quiz/submit/', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        quiz_id: questionId,
                        answer: responses[questionId],
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to submit responses');
                }
            }

            setSubmitted(true);
            alert('Thank you! Your responses have been submitted.');
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
                <p>Our custom quiz is designed to help you find the best match for your needs.</p>
            </div>
            
            <div key={currentQuestion.id} className="quiz-question-container">
                <div className="quiz-question">
                    <h2>{currentQuestion.question}</h2>
                    {currentQuestion.description && <p>{currentQuestion.description}</p>}
                </div>
                <div className="quiz-options">
                    {currentQuestion.question_type === 'text' && (
                        <textarea
                            placeholder="Type your answer here..."
                            rows="4"
                            value={responses[currentQuestion.id] || ''}
                            onChange={(e) => handleChange(currentQuestion.id, e.target.value)}
                            className="quiz-textarea"
                        />
                    )}

                    {currentQuestion.question_type === 'multiple_choice' &&
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
                </div>
            </div>

            <div className="quiz-navigation">
                <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}  className="submit-btn">
                    Previous
                </button>
                {currentQuestionIndex < questions.length - 1 ? (
                    <button onClick={handleNext}  className="submit-btn">Next</button>
                ) : (
                    <button onClick={handleSubmit} disabled={submitting}  className="submit-btn">
                        {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                )}
            </div>

            {submitted && <p className="success-message">Your responses have been submitted. Thank you!</p>}
        </div>
    );
};

export default Quiz;