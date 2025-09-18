import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import "./index.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

const UploadPage = () => {
  // --- STATE MANAGEMENT ---
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // --- DATA FETCHING ---
  // Fetch tags from the API when the component mounts
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/tags");
        if (response.ok) {
          const data = await response.json();
          setTags(data.tags || []); // Set tags, with a fallback for safety
        }  else if (response.status === 429) {
         throw new Error("rate-limited ");
       } else {
          console.error("Failed to fetch tags:", response.statusText);
          setError("Failed to load tags. Please refresh the page.");
        }
      } catch (error) {
        if (error.message === "rate-limited ") {
          navigate("/ratelimiter", { replace: true });
        }
        console.error("Error fetching tags:", error);
        setError("A network error occurred while loading tags.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  // --- EVENT HANDLERS ---
  // Handle selecting/unselecting tags
  const handleTagChange = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId) // Remove if already selected
        : [...prev, tagId]                 // Add if not selected
    );
  };

  // Generic file handler for both click and drop events
  const processFile = (selectedFile) => {
    if (!selectedFile) return;

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
  };
  
  // Handle file selection from input
  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  // Handle drag & drop events
  const handleDrop = (e) => {
    e.preventDefault();
    processFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // --- HELPER FUNCTION ---
  // Converts a file to a Base64 data URI string
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  // --- MAIN UPLOAD LOGIC ---
  const handlePublish = async () => {
    // 1. Validation
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    if (!title.trim()) {
      setError("A title for your photo is required.");
      return;
    }
    const token = Cookies.get("token");
    const userId = Cookies.get("userid");
    if (!token || !userId) {
      setError("Authentication error. Please log in again.");
      return;
    }

    setIsUploading(true);
    setError("");
    setProgress(0); // Start progress bar

    try {
      // 2. Convert file and prepare JSON payload
      const imageBase64 = await toBase64(file);
      
      const payload = {
        photo: imageBase64,
        title: title.trim(),
        user_id: userId,
        tags: selectedTags,
      };

      // 3. Send the request as JSON
      const response = await fetch("http://127.0.0.1:8000/api/photos", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': "application/json",
          'Content-Type': "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Upload response:", result);
      if (response.ok) {
        setProgress(100); // Mark as complete
        // Reset form after a short delay to show completion
        setTimeout(() => {
            setFile(null);
            setTitle("");
            setSelectedTags([]);
            setProgress(0);
        }, 1500);
      }  else if (response.status === 429) {
         throw new Error("rate-limited ");
       } else {
        setError(result.message || "An unknown error occurred during upload.");
      }
    } catch (err) {
      if(err.message === "rate-limited ") {
          navigate("/ratelimiter", { replace: true });
      }
      console.error("An error occurred during the upload:", err);
      setError("Upload failed due to a network error. Please check your connection and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- JSX RENDERING ---
  return (
    <div className="photoverse-container">
      <Header />
      <div className="padding-container">
        <section className="upload-section">
          <h1 className="upload-title">Upload Your Photo</h1>
          <p className="upload-subtitle">Share your work with the PhotoVerse community.</p>

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

              {/* Tag Selection */}
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

              {/* Progress Bar and Status */}
              {file && (
                <>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="progress-text">
                    {progress === 100 ? "Upload complete ✅" : (isUploading ? `Uploading...` : "Ready to upload")}
                  </p>
                </>
              )}

              <button
                className="publish-btn"
                disabled={!file || isUploading || !title.trim()}
                onClick={handlePublish}
              >
                {isUploading ? "Publishing..." : "Publish Photo"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UploadPage;