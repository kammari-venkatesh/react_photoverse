import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import "./index.css";
import Cookies from "js-cookie";
const UploadPage = () => {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchtags = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/tags");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched tags:", data);
          setTags(data.tags); // ✅ store tags in state
        } else {
          console.error("Failed to fetch tags:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchtags();
  }, []);

  // ✅ Handle selecting/unselecting tags
  const handleTagChange = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId) // remove if already selected
        : [...prev, tagId] // add if not selected
    );
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setError('');
      setFile(selectedFile);
      setProgress(0);
    }
  };

  // Handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setError('');
      setFile(droppedFile);
      setProgress(0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

const handlePublish = async () => {
  if (!file) {
    setError("Please select a file");
    return;
  }

  const formData = new FormData();
  formData.append("photo", file);
  formData.append("title", title || "Untitled");

  // Append tags correctly as array
  selectedTags.forEach(tag => formData.append("tags[]", tag));

  try {
    const response = await fetch("http://127.0.0.1:8000/api/photos", {
      method: "POST",
      body: formData, // ✅ DO NOT set Content-Type manually
    });

    const result = await response.json();
    console.log("✅ Upload result:", result);

    if (response.ok) {
      setProgress(100);
      setError("");
      alert("Photo uploaded successfully!");
    } else {
      setError(result.message || "Upload failed");
    }
  } catch (err) {
    console.error("❌ Upload error:", err);
    setError("Upload failed. Please try again.");
  }
};



  return (
    <div className="photoverse-container">
      {/* ✅ Reused Navbar */}
      <Header />

      {/* ✅ Upload Section */}
      <div className="padding-container">
        <section className="upload-section">
          <h1 className="upload-title">Upload Your Photo</h1>
          <p className="upload-subtitle">
            Share your work with the PhotoVerse community.
          </p>

          <div className="upload-content">
            {/* Upload Box */}
            <div
              className="upload-box"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
              <div className="upload-icon">☁️</div>
              <p>{file ? file.name : "Drag & drop a file or click to upload"}</p>
              <span className="upload-info">PNG, JPG, GIF up to 10MB</span>
            </div>

            {/* Form */}
            <div className="upload-form">
              {error && <div className="error-message">{error}</div>}
              <input
                type="text"
                placeholder="e.g. 'Golden Hour at the Lake'"
                className="upload-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* ✅ Checkboxes for tags */}
              <div className="tag-list">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <label key={tag.id} className="tag-checkbox">
                      <input
                        type="checkbox"
                        value={tag.id}
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => handleTagChange(tag.id)}
                      />
                      {tag.name}
                    </label>
                  ))
                ) : (
                  <p>No tags available</p>
                )}
              </div>

              {file && (
                <>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    {progress < 100
                      ? `Uploading... ${progress}%`
                      : "Upload complete ✅"}
                  </p>
                </>
              )}

              <button 
                className="publish-btn" 
                disabled={!file || (progress > 0 && progress < 100)}
                onClick={handlePublish}
              >
                Publish Photo
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UploadPage;
