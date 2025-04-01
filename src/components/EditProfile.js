import React, { useState } from 'react';

function UpdateUserForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: ''
  });
  const [message, setMessage] = useState('');
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
        setMessage('User not authenticated. Please log in.');
        return;
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/update-user/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const data = await response.json();
            setMessage(`User updated successfully! Name: ${data.first_name} ${data.last_name}`);
            console.log('Success:', data);
        } else if (response.status === 401) {
            setMessage('Unauthorized: Please log in again.');
            localStorage.removeItem('access_token'); // Clear the token if unauthorized
        } else if (response.status === 405) {
            setMessage('Method Not Allowed: Please check the request method.');
        } else {
            const errorData = await response.json();
            setMessage(`Error: ${errorData.detail || 'Update failed'}`);
            console.error('Error:', errorData);
        }
    } catch (error) {
        setMessage('Network error');
        console.error('Network error:', error);
    }
};
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Update User Information</h2>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          className="border p-2 mb-2 w-full rounded"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          className="border p-2 mb-2 w-full rounded"
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          className="border p-2 mb-4 w-full rounded"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Update
        </button>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </form>
    </div>
  );
}

export default UpdateUserForm;