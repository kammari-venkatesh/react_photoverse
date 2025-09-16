import React from "react";
import "./index.css";
import Header from '../Header/Header';
import { useParams } from "react-router";
import { useState, useEffect } from "react";

export default function PhotoCard() {
  const { id } = useParams();
  const [photoDetails, setPhotoDetails] = useState(null);

  useEffect(() => {
    const getPhotoDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/photos/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          setPhotoDetails(data.photo);
          console.log(data);
        } else {
          console.error("Failed to fetch photo details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching photo details:", error);
      }
    };

    getPhotoDetails();
  }, [id]);

  // Render a loading state while data is being fetched
  if (!photoDetails) {
    return (
      <div>
        <Header />
        <p>Loading photo details...</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="photo-card">
        <div className="image-container">
          <img
            src={photoDetails.path} // safe now, photoDetails is guaranteed to exist
            alt={photoDetails.title}
            className="photo"
          />
        </div>
        <div className="photo-details">
          <h2 className="photo-title">{photoDetails.title}</h2>
          <div className="tags">
            <span className="tag">Nature</span>
            <span className="tag">Landscape</span>
            <span className="tag">Sunset</span>
            <span className="tag">Mountains</span>
            <span className="tag">Photography</span>
          </div>
        </div>
      </div>
    </div>
  );
}
