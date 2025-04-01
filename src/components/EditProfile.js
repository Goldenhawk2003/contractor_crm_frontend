import React, { useState } from 'react';

function UpdateProfile({ userType }) {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      const response = await fetch('/api/profile/update/', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: data,
      });
      const result = await response.json();
      alert('Profile updated successfully!');
      console.log(result);
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} />
      <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} />

      {userType === 'client' && (
        <>
          <input type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} />
          <input type="text" name="address" placeholder="Address" onChange={handleChange} />
          <input type="text" name="company_name" placeholder="Company Name" onChange={handleChange} />
        </>
      )}

      {userType === 'contractor' && (
        <>
          <input type="text" name="job_type" placeholder="Job Type" onChange={handleChange} />
          <input type="number" name="experience_years" placeholder="Experience Years" onChange={handleChange} />
          <input type="number" name="hourly_rate" placeholder="Hourly Rate" onChange={handleChange} />
          <input type="text" name="location" placeholder="Location" onChange={handleChange} />
          <textarea name="profile_description" placeholder="Profile Description" onChange={handleChange}></textarea>
          <input type="file" name="picture" onChange={handleChange} />
          <input type="file" name="logo" onChange={handleChange} />
        </>
      )}

      <button type="submit">Update Profile</button>
    </form>
  );
}

export default UpdateProfile;