import React, { useState } from "react";

const UploadTutorial = () => {
     const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e, type) => {
    if (type === "video") {
      setVideo(e.target.files[0]);
    } else if (type === "thumbnail") {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !video || !thumbnail) {
      setMessage("Please fill out all fields and upload both files.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", video);
    formData.append("thumbnail", thumbnail);

    setUploading(true);

    try {
      const response = await fetch("http://localhost:8000/api/tutorials/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Tutorial uploaded successfully!");
        setTitle("");
        setDescription("");
        setVideo(null);
        setThumbnail(null);
      } else {
        setMessage("Upload failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }

    setUploading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Upload a Tutorial</h2>

      {message && <p className="text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Video Upload */}
        <div>
          <label className="block font-semibold">Upload Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, "video")}
            required
          />
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block font-semibold">Upload Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "thumbnail")}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};


export default UploadTutorial;