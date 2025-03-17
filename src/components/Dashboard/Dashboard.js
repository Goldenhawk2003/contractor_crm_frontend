import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [formResponses, setFormResponses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('text');
  const [newChoices, setNewChoices] = useState('');
  const [quizError, setQuizError] = useState(null);

  // Fetch dashboard data
  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${BASE_URL}/dashboard/`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch quiz responses data
  const fetchFormResponses = async () => {
    try {
      const response = await fetch(`${BASE_URL}/dashboard/form-responses/`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch form responses.');
      }

      const data = await response.json();
      setFormResponses(data.responses);
    } catch (error) {
      setFormError('Error loading form responses.');
    }
  };

  // Fetch quiz questions data
  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/quiz/questions/`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch questions.');
      }

      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      setQuizError('Error loading quiz questions.');
    }
  };

  const addQuestion = async () => {
    if (!newQuestion.trim()) {
      alert("Question text cannot be empty.");
      return;
    }

    if (newQuestionType === "multiple_choice" && !newChoices.trim()) {
      alert("Choices cannot be empty for multiple-choice questions.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/quiz/add-question/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          question: newQuestion,
          description: newDescription,
          question_type: newQuestionType,
          choices: newQuestionType === "multiple_choice" ? newChoices.split(',') : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add question.');
      }

      const data = await response.json();
      setQuestions([...questions, {
        id: data.id,
        question: newQuestion,
        description: newDescription,
        question_type: newQuestionType,
        choices: newQuestionType === "multiple_choice" ? newChoices.split(',') : null,
      }]);
      setNewQuestion('');
      setNewDescription('');
      setNewQuestionType('text');
      setNewChoices('');
    } catch (error) {
      alert('Error adding question. Please try again.');
    }
  };

  const deleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`${BASE_URL}/quiz/delete-question/${questionId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete question.');
      }

      // Remove the question from the state
      setQuestions(questions.filter((question) => question.id !== questionId));
      alert('Question deleted successfully.');
    } catch (error) {
      alert('Error deleting question. Please try again.');
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/approve-contractor/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve contractor.');
      }

      alert('Contractor approved successfully!');
      fetchDashboard(); // Refresh data
    } catch (error) {
      alert('Error approving contractor. Please try again.');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/reject-contractor/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject contractor.');
      }

      alert('Contractor rejected successfully!');
      fetchDashboard(); // Refresh the data
    } catch (error) {
      alert('Error rejecting contractor. Please try again.');
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchFormResponses();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, []);
 

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Super Admin Dashboard</h1>
        <p>Welcome back, <strong>Admin</strong>!</p>
      </header>

      {isLoading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {!isLoading && data && (
        <div className="dashboard-content">
          {/* Key Metrics */}
          <section className="metrics">
            <h2>Key Metrics</h2>
            <div className="metric-cards">
              {[
                { title: "Total Contractors", value: data.total_contractors },
                { title: "Total Clients", value: data.total_clients },
                { title: "Outstanding Invoices", value: data.outstanding_invoices },
                { title: "Paid Invoices", value: data.paid_invoices },
              ].map((metric, index) => (
                <div key={index} className="card">
                  <h3>{metric.title}</h3>
                  <p>{metric.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pending Registrations */}
          <section className="pending-applications">
            <h2>Pending Contractor Applications</h2>
            {data.pending_applications && data.pending_applications.length > 0 ? (
              <ul className="pending-list">
                {data.pending_applications.map((app) => (
                  <li key={app.id} className="application-item">
                    <p><strong>Username:</strong> {app.username}</p>
                    <p><strong>Job Type:</strong> {app.job_type}</p>
                    <p><strong>Location:</strong> {app.location}</p>
                    <p><strong>Email:</strong> {app.email}</p>
                    
                    <img
                      src={app.logo && app.logo.startsWith('http') ? app.logo : `${BASE_URL}${app.logo}`}
                      alt={`${app.username}'s logo`}
                      className="application-logo"
                    />
                    <div className="application-buttons">
                      <button className="approve-btn" onClick={() => handleApprove(app.id)}>
                        Approve
                      </button>
                      <button className="reject-btn" onClick={() => handleReject(app.id)}>
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No pending applications.</p>
            )}
          </section>

          {/* Service Requests */}
          <section className="service-requests">
            <h2>Recent Service Requests</h2>
            {data.recent_service_requests && data.recent_service_requests.length > 0 ? (
              <ul className="service-requests-list">
                {data.recent_service_requests.map((request) => (
                  <li key={request.id} className="service-request-item">
                    <p><strong>User:</strong> {request.user}</p>
                    <p><strong>Request:</strong> {request.request}</p>
                    <p><strong>Created At:</strong> {request.created_at}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent service requests available.</p>
            )}
          </section>

          {/* Quiz Responses Dashboard */}
          <section className="form-responses">
            <h2>Quiz Answers</h2>
            {formError && <p className="error-message">{formError}</p>}
            {formResponses.length > 0 ? (
              <ul className="form-responses-list">
                {formResponses.map((group, index) => (
                  <li key={index} className="form-response-group">
                    <h3>Client: {group.client}</h3>
                    <ul>
                      {group.responses.map((response, respIndex) => (
                        <li key={respIndex} className="form-response-item">
                          <p><strong>Question:</strong> {response.quiz_question}</p>
                          {response.answer && <p><strong>Answer:</strong> {response.answer}</p>}
                          {response.selected_choice && <p><strong>Selected Choice:</strong> {response.selected_choice}</p>}
                          {response.contractor_suggestion && <p><strong>Contractor Suggestion:</strong> {response.contractor_suggestion}</p>}
                          <p><strong>Submitted At:</strong> {response.created_at}</p>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No form responses available.</p>
            )}
          </section>

          {/* Quiz Management */}
          <section className="quiz-management">
            <h2>Manage Quiz Questions</h2>
            {quizError && <p className="error-message">{quizError}</p>}
            <div className="add-question">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter a new question..."
              />
              <select
                value={newQuestionType}
                onChange={(e) => setNewQuestionType(e.target.value)}
              >
                <option value="text">Text Answer</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="date">Date Picker</option> {/* NEW OPTION */}
                <option value="text_with_image">Text Answer with Optional Image</option> 
              </select>
              {newQuestionType === "multiple_choice" && (
                <input
                  type="text"
                  value={newChoices}
                  onChange={(e) => setNewChoices(e.target.value)}
                  placeholder="Enter choices, separated by commas..."
                />
              )}
              <button onClick={addQuestion} className="user-button">
                Add Question
              </button>
            </div>
            <ul className="question-list">
              {questions.map((question) => (
                <li key={question.id} className="question-item">
                  <p><strong>Question:</strong> {question.question}</p>
                  {question.description && <p><strong>Description:</strong> {question.description}</p>}
                  <p><strong>Type:</strong> {question.question_type}</p>
                  {question.question_type === "multiple_choice" && (
                    <p><strong>Choices:</strong> {question.choices.join(', ')}</p>
                  )}
                  <button onClick={() => deleteQuestion(question.id)} className="delete-btn">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {!isLoading && !data && <p>No dashboard data available.</p>}
    </div>
  );
};

export default Dashboard;