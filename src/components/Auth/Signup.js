import React, { useState, useEffect } from 'react';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    role: 'client',
    job_type: '',
    hourly_rate: '',
    logo: null,
  });

  const [error, setError] = useState('');
  const [locationInput, setLocationInput] = useState('');

  useEffect(() => {
    if (!window.google) return;

    const input = document.getElementById('location-autocomplete');
    if (!input) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ['geocode'],
      componentRestrictions: { country: 'ca' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const formattedAddress = place?.formatted_address || '';
      setFormData(prev => ({ ...prev, location: formattedAddress }));
      setLocationInput(formattedAddress);
    });
  }, []);

  const handleChange = (e) => {
    setError('');
    const { name, value, files } = e.target;

    if (name === 'logo') {
      setFormData(prev => ({ ...prev, logo: files[0] }));
    } else if (name === 'location') {
      setLocationInput(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword, role, job_type, hourly_rate, logo } = formData;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username) return "Username is required";
    if (!email || !emailPattern.test(email)) return "Please enter a valid email address";
    if (password.length < 6) return "Password should be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";

    if (role === 'professional') {
      if (!job_type) return "Job type is required for professionals";
      if (!hourly_rate || isNaN(hourly_rate) || hourly_rate <= 0) return "Hourly rate must be a positive number";
      if (!logo) return "Logo is required for professionals";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const formDataPayload = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        formDataPayload.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/register/`, {
        method: 'POST',
        body: formDataPayload,
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setError('');
        setFormData({
          username: '',
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          confirmPassword: '',
          location: '',
          role: 'client',
          job_type: '',
          hourly_rate: '',
          logo: null,
        });
        setLocationInput('');
      } else {
        setError(data.error || "An error occurred during registration");
      }
    } catch (error) {
      setError("Failed to connect to the server");
    }
  };

  useEffect(() => {
    document.body.classList.add("specific-page-signup");
    return () => {
      document.body.classList.remove("specific-page-signup");
    };
  }, []);

  return (
    <div className="signup-page">
      <h1 className="sign-up-header">Welcome to ETN</h1>
      <form onSubmit={handleSubmit} className="cont">
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required className="inp" />
        <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} placeholder="First Name" required className="inp" />
        <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} placeholder="Last Name" required className="inp" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="inp" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="inp" />
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required className="inp" />

        <input
          id="location-autocomplete"
          type="text"
          name="location"
          placeholder="Enter location"
          className="inp"
          value={locationInput}
          onChange={handleChange}
        />

        <div className="role">
          <label>
            <input
              type="radio"
              name="role"
              value="client"
              checked={formData.role === 'client'}
              onChange={handleChange}
              className="radio"
            />
            I am a Home/Business owner
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="professional"
              checked={formData.role === 'professional'}
              onChange={handleChange}
              className="radio"
            />
            I am a Contractor
          </label>
        </div>

        {formData.role === 'professional' && (
          <>
            <h3 className="sign-up-h3">
              Sign up to join our exclusive trade network! We will review your page, and send you an email once approved.
            </h3>

            <select name="job_type" value={formData.job_type} onChange={handleChange} required className="jobtype">
              <option value="" disabled>Select Profession</option>
              <option value="Plumbing">Plumber</option>
              <option value="Electrical">Electrician</option>
              <option value="Roofing">Roofer</option>
              <option value="Concrete">Concrete</option>
              <option value="Equipment Operator">Heavy Equipment Operator</option>
              <option value="Carpentery">Carpenter</option>
              <option value="General Contractor">General Contractor</option>
              <option value="Painting">Painter</option>
              <option value="Landscaper">Landscaper</option>
              <option value="Mechanic">Mechanic</option>
              <option value="Welder">Welder</option>
              <option value="Mason">Mason</option>
              <option value="HVAC Technician">HVAC Technician</option>
              <option value="Snow Removal">Snow Removal</option>
              <option value="Other">Other</option>
            </select>
            {/* Show extra textbox if 'Other' selected */}
    {formData.job_type === 'Other' && (
      <input
        type="text"
        name="custom_job_type"
        value={formData.custom_job_type || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, custom_job_type: e.target.value }))}
        placeholder="Please specify your profession"
        required
        className="inp"
      />
    )}

            <input
              type="text"
              name="hourly_rate"
              value={formData.hourly_rate}
              onChange={handleChange}
              placeholder="Hourly Rate (e.g., 50)"
              required
              className="inp"
            />

            <div>
              <h3 className="sign-up-h3">Upload your logo/Profile Picture:</h3>
              <input
                type="file"
                name="logo"
                onChange={handleChange}
                accept="image/*"
                required
                className="inp-file"
              />
            </div>
          </>
        )}

        <button className="sbmit" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;