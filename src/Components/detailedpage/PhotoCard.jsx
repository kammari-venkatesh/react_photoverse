import React from "react";
import "./index.css";
import Header from '../Header/Header';
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

export default function PhotoCard() {
  const { id } = useParams();
  const [photoDetails, setPhotoDetails] = useState(null);
  const [userid, setUserid] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);

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
          setTags(data.photo.tags || []);
          console.log(data);
          setUserid(data.photo.user_id);
          console.log(data);
        }
         else if (response.status === 429) {
         throw new Error("rate-limited ");
       }
         else {
          console.error("Failed to fetch photo details:", response.statusText);
        }
      } catch (error) {
        if (error.message === "rate-limited ") {
          navigate("/ratelimiter", { replace: true });
        }
        console.error("Error fetching photo details:", error);
      }
    };

    getPhotoDetails();
  }, [id]);
 useEffect(() => {
   const fetchUserData = async () => {
     try {
       const token = Cookies.get("token");
       if (!token) {
         console.error("No token found");
         return;
       }
       const response = await fetch(`http://127.0.0.1:8000/api/user/${userid}`, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       });
       if (response.ok) {
         const data = await response.json();
         console.log("User data fetched successfully:", data);
         setUsername(data.user.username);
       }
         else if (response.status === 429) {
         throw new Error("rate-limited ");
       } else {
         console.error("Failed to fetch user data:", response.statusText);
       }
     } catch (error) {
       if (error.message === "rate-limited ") {
         navigate("/ratelimiter", { replace: true });
       }
       console.error("Error fetching user data:", error);
     }
   };
   fetchUserData();
}, [userid]);
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
          <p className="photo-uploader">Uploaded by: <span className="username">{username || 'Unknown'}</span></p>
          <p className="photo-date">Uploaded on: {new Date(photoDetails.created_at).toLocaleDateString()}</p>
          <div className="tags">
            <h1 className="tags-title">Tags:</h1>
            {
              tags.map((tag) => (
                <span key={tag} className="tag">{tag.name}</span>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
