import React from "react";
import "./index.css";
import { useEffect,useState } from "react";
import Header from "../Header/Header";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBin3Line } from "react-icons/ri";

export default function Profile() {
  const user = Cookies.get("userid") ? JSON.parse(Cookies.get("userid")) : null;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userPhotos, setUserPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/", { replace: true });
  }
  const handleDelete = async (photoId) => {

    try {
      const token = Cookies.get("token");
      const response = await fetch(`http://127.0.0.1:8000/api/photos/${photoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setUserPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== photoId));
        console.log("Photo deleted successfully");
      } else {
        console.error("Failed to delete photo:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  useEffect(() => {
   const fetchUserData = async () => {
     try {
       const token = Cookies.get("token");
       if (!token) {
         console.error("No token found");
         return;
       }
       const response = await fetch(`http://127.0.0.1:8000/api/user/${user}`, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       });
       if (response.ok) {
         const data = await response.json();
         console.log("User data fetched successfully:", data);
         setUsername(data.user.username);
            setEmail(data.user.email);
       } else {
         console.error("Failed to fetch user data:", response.statusText);
       }
     } catch (error) {
       console.error("Error fetching user data:", error);
     }
   };
   fetchUserData();
}, [user]);
useEffect(() => {
const fetchuserphotos = async () => {
    setIsLoading(true);
    try{
        const token = Cookies.get("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await fetch(`http://127.0.0.1:8000/api/userphotos/${user}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserPhotos(data.photos || []);
          console.log("User photos fetched successfully:", data);
        } else {
          console.error("Failed to fetch user photos:", response.statusText);
          setUserPhotos([]);
        }
      } catch (error) {
        console.error("Error fetching user photos:", error);
        setUserPhotos([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchuserphotos();
  },[user]); // Remove userPhotos.length from dependencies

  return (
    <>
    <Header/>
    <div className="profile-container">
      {/* Profile Header */}

      <div className="profile-header">
        <div className="profile-background">
        <img
          src="https://xinva.ai/wp-content/uploads/2023/12/106.jpg"
          alt="Profile"
          className="profile-avatar"
        />
        
        <div className="profile-info">
          <h2 className="profile-username">{username}</h2>
          <p className="profile-email">{email}</p>
          <p className="profile-uploads">{userPhotos ? userPhotos.length : 0} Uploads</p>
        </div>
        </div>
        <button className="profile-logout" onClick={handleLogout}>Logout</button>
      </div>

      <hr className="profile-divider" />

      {/* Photos Section */}
      <div className="profile-photos-section">
        <h3 className="profile-photos-title">Photos</h3>
        <div className="profile-photos-grid">
        {isLoading ? (
          <div className="loading">Loading photos...</div>
        ) : userPhotos.length > 0 ? (
  userPhotos.map((photo) => (
    <div key={photo.id} className="profile-photo-wrapper">
      <img
        src={photo.path}
        alt={photo.title}
        className="profile-photo"
      />
      <div className="photo-actions-overlay">
        <button className="photo-btn update-btn"><AiOutlineEdit />
</button>
        <button className="photo-btn delete-btn" onClick={() => handleDelete(photo.id)}><RiDeleteBin3Line />
</button>
      </div>
    </div>
  ))
) : (
  <p className="no-photos">No photos uploaded yet.</p>
)}

        </div>
      </div>
    </div></>
  );
}
