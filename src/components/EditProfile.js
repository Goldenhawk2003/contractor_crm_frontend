import React, { useState } from "react";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    location: "",
    profession: "",
    job_type: "",
    experience_years: "",
    rating: "",
    profile_description: "",
    hourly_rate: "",
    phone_number: "",
    address: "",
    company_name: ""
  });
  
  const [logo, setLogo] = useState(null);
  const [picture, setPicture] = useState(null);
  const [result, setResult] = useState("");

  // Handle text/number input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === "logo") {
        setLogo(files[0]);
      } else if (name === "picture") {
        setPicture(files[0]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();

    // Append only the fields that are non-empty
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        payload.append(key, formData[key]);
      }
    });
    if (logo) payload.append("logo", logo);
    if (picture) payload.append("picture", picture);

    try {
      const response = await fetch("/api/profile/update/", {
        method: "PATCH",
        body: payload
        // If you need auth headers, add them here, e.g.:
        // headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
      });
      const data = await response.json();
      if (response.ok) {
        setResult("Profile updated successfully! 🎉");
      } else {
        setResult("Error: " + (data.error || "Failed to update profile."));
      }
    } catch (error) {
      setResult("Error: " + error.message);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Update Your Profile</h1>
      <form onSubmit={handleSubmit}>
        {/* Common User Fields */}
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            name="location"
            id="location"
            placeholder="Enter your location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="profession">Profession</label>
          <input
            type="text"
            name="profession"
            id="profession"
            placeholder="Enter your profession"
            value={formData.profession}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="logo">Logo</label>
          <input type="file" name="logo" id="logo" onChange={handleFileChange} />
        </div>

        <hr />

        {/* Contractor Profile Fields */}
        <h2>Contractor Profile (if applicable)</h2>
        <div>
          <label htmlFor="job_type">Job Type</label>
          <input
            type="text"
            name="job_type"
            id="job_type"
            placeholder="e.g., Electrician, Plumber"
            value={formData.job_type}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="experience_years">Experience Years</label>
          <input
            type="number"
            name="experience_years"
            id="experience_years"
            placeholder="Years of experience"
            value={formData.experience_years}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="rating">Rating</label>
          <input
            type="number"
            step="0.1"
            name="rating"
            id="rating"
            placeholder="Your rating"
            value={formData.rating}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="profile_description">Profile Description</label>
          <textarea
            name="profile_description"
            id="profile_description"
            placeholder="Describe your skills"
            value={formData.profile_description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label htmlFor="hourly_rate">Hourly Rate</label>
          <input
            type="number"
            name="hourly_rate"
            id="hourly_rate"
            placeholder="Your hourly rate"
            value={formData.hourly_rate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="picture">Picture</label>
          <input type="file" name="picture" id="picture" onChange={handleFileChange} />
        </div>

        <hr />

        {/* Client Profile Fields */}
        <h2>Client Profile (if applicable)</h2>
        <div>
          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            id="phone_number"
            placeholder="Your phone number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Your address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="company_name">Company Name</label>
          <input
            type="text"
            name="company_name"
            id="company_name"
            placeholder="Your company name"
            value={formData.company_name}
            onChange={handleChange}
          />
        </div>

        <button type="submit" style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
          Update Profile
        </button>
      </form>
      {result && <p style={{ marginTop: "1rem" }}>{result}</p>}
    </div>
  );
};

export default UpdateProfile;