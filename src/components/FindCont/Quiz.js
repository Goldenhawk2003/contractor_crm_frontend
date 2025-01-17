import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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

    const handleSubmit = async () => {
        const unansweredQuestions = questions.filter(
            (question) => !responses[question.id]
        );

        if (unansweredQuestions.length > 0) {
            alert('Please answer all questions before submitting.');
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

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <h1>Help Us Help You</h1>
                <p>Our custom quiz is designed to help you find the best match for your needs.</p>
            </div>

            {questions.map((question) => (
                <div key={question.id} className="quiz-question-container">
                    <div className="quiz-question">
                        <h2>{question.question}</h2>
                        {question.description && <p>{question.description}</p>}
                    </div>
                    <div className="quiz-options">
                        {question.question_type === 'text' && (
                            <textarea
                                placeholder="Type your answer here..."
                                rows="4"
                                value={responses[question.id] || ''}
                                onChange={(e) => handleChange(question.id, e.target.value)}
                                className="quiz-textarea"
                            />
                        )}

                        {question.question_type === 'multiple_choice' &&
                            question.choices &&
                            question.choices.map((choice, index) => (
                                <div key={index} className="quiz-choice">
                                    <input
                                        type="radio"
                                        id={`choice-${index}-${question.id}`}
                                        name={`question-${question.id}`}
                                        value={choice}
                                        checked={responses[question.id] === choice}
                                        onChange={(e) => handleChange(question.id, e.target.value)}
                                    />
                                    <label htmlFor={`choice-${index}-${question.id}`}>
                                        {choice}
                                    </label>
                                </div>
                            ))}
                    </div>
                </div>
            ))}

            {!submitted && (
                <button
                    onClick={handleSubmit}
                    className="submit-button"
                    disabled={submitting}
                >
                    {submitting ? 'Submitting...' : 'Submit'}
                </button>
            )}

            {submitted && (
                <p className="success-message">
                    Your responses have been submitted. Thank you!
                </p>
            )}
        </div>
    );
};

export default Quiz;