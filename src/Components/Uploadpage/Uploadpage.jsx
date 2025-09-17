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
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchtags = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/tags");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched tags:", data);
          setTags(data.tags || []); // ✅ store tags in state with fallback
        } else {
          console.error("Failed to fetch tags:", response.statusText);
          setError("Failed to load tags. Please refresh the page.");
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        setError("Failed to load tags. Please refresh the page.");
      } finally {
        setIsLoading(false);
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

      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a valid image file (JPG, PNG, or GIF)');
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
  console.log("🚀 handlePublish called");

  // ✅ Step 1: Check file
  if (!file) {
    console.warn("⚠️ No file selected");
    setError("Please select a file");
    return;
  }
  console.log("📂 File selected:", file);

  // ✅ Step 2: Check title
  if (!title.trim()) {
    console.warn("⚠️ No title entered");
    setError("Please enter a title for your photo");
    return;
  }
  console.log("📝 Title entered:", title.trim());

  // ✅ Step 3: Check token
  const token = Cookies.get("token");
  if (!token) {
    console.warn("⚠️ No auth token found");
    setError("Please log in to upload photos");
    return;
  }
  console.log("🔑 Token found:", token);

  setIsUploading(true);
  setError("");
  console.log("⏳ Upload started...");

  // ✅ Step 4: Build FormData
  const formData = new FormData();
  formData.append("photo", file);
  formData.append("title", title.trim());
  formData.append("user_id", Cookies.get("userid"));

  console.log("🏷️ Selected tags:", selectedTags);
  selectedTags.forEach((tag, index) => {
    console.log(`➡️ Appending tag[${index}]:`, tag);
    formData.append("tags[]", tag);
  });

  // Debug: show FormData content
  for (let [key, value] of formData.entries()) {
    console.log(`📦 FormData entry -> ${key}:`, value);
  }

  try {
    console.log("📤 Sending FormData with fetch...");

    const response = await fetch("http://127.0.0.1:8000/api/photos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        // ❌ Don’t set Content-Type manually
      },
      body: formData,
    });

    console.log("📥 Server responded:", response.status);

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Upload success:", result);

      setProgress(100);
      setError("");

      // Reset form
      console.log("🔄 Resetting form...");
      setFile(null);
      setTitle("");
      setSelectedTags([]);
      setProgress(0);
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Upload failed:", errorData);
      setError(errorData.message || "Upload failed");
    }
  } catch (err) {
    console.error("❌ Exception caught in handlePublish:", err);
    setError("Upload failed. Please try again.");
  } finally {
    setIsUploading(false);
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
                accept="image/jpeg,image/png,image/gif"
                hidden
                onChange={handleFileChange}
                onClick={(e) => e.target.value = null} // Reset file input on click
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
                {isLoading ? (
                  <p>Loading tags...</p>
                ) : tags.length > 0 ? (
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
                disabled={!file || isUploading || !title.trim()}
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
