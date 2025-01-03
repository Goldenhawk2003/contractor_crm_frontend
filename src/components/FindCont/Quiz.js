import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = () => {
    const [questions, setQuestions] = useState([]); // Store all quiz questions
    const [responses, setResponses] = useState({}); // Track user responses
    const [error, setError] = useState(null); // Track errors
    const [submitted, setSubmitted] = useState(false); // Track submission status

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/quiz/questions/');
                if (!response.ok) {
                    throw new Error('Failed to fetch questions');
                }
                const data = await response.json();
                setQuestions(data.questions); // Set all questions to state
            } catch (err) {
                setError(err.message);
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
        try {
            // Iterate over all questions and send responses to the backend
            for (const questionId of Object.keys(responses)) {
                const response = await fetch('http://localhost:8000/api/quiz/submit/', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        quiz_id: questionId,
                        answer: responses[questionId], // Send the user's answer
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
        }
    };

    if (error) return <p className="error">{error}</p>;
    if (!questions.length) return <p>Loading questions...</p>;

    return (
        <div>
            <div className="parent-container">
                 <h1 className="header">Help Us Help You</h1>
                 <p>Our Custom Quiz Designed to help you find the best match for your needs</p>
            </div>
            {questions.map((question) => (
                <div key={question.id} className="quiz-question">
                    <h2>{question.question}</h2>
                    <p>{question.description}</p>
                    
                    {/* Render options for text and multiple-choice questions */}
                    {question.question_type === 'text' && (
                        <textarea
                            placeholder="Type your answer here..."
                            rows="4"
                            cols="50"
                            value={responses[question.id] || ''}
                            onChange={(e) => handleChange(question.id, e.target.value)}
                        />
                    )}

                    {question.question_type === 'multiple_choice' && question.choices && (
                        question.choices.map((choice, index) => (
                            <div key={index}>
                                <input
                                    type="radio"
                                    id={`choice-${index}-${question.id}`}
                                    name={`question-${question.id}`}
                                    value={choice}
                                    checked={responses[question.id] === choice}
                                    onChange={(e) => handleChange(question.id, e.target.value)}
                                />
                                <label htmlFor={`choice-${index}-${question.id}`}>{choice}</label>
                            </div>
                        ))
                    )}
                </div>
            ))}

            {/* Display the submit button outside the loop */}
            {!submitted && (
                <button onClick={handleSubmit} className="submit-button">
                    Submit
                </button>
            )}
        </div>
    );
};

export default Quiz;