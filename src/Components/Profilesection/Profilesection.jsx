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
  const [showEditModal, setShowEditModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [photodetails, setPhotodetails] = useState({
    id: null,
    title: '',
    description: '',
    tags: []
  });
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
const handleEdit = async(photoId) => {
 setShowEditModal(true);
  const getuploadphoto = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`http://127.0.0.1:8000/api/photos/${photoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPhotodetails(data.photo);
        console.log("Fetched photo data:", data);
        // Populate your form fields with the fetched data
      } else {
        console.error("Failed to fetch photo data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching photo data:", error);
    }
  };
  getuploadphoto();
}
 useEffect(() => {
    const fetchtags = async () => {
    
      try {
        const response = await fetch("http://127.0.0.1:8000/api/tags");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched tags:", data);
          
          setCategories(data.tags); // ✅ store tags in state
        } else {
          console.error("Failed to fetch tags:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchtags();
  }, [setShowEditModal]);







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
       }
       else if (response.status === 429) {
         throw new Error("rate-limited ");
       }
       else {
         console.error("Failed to fetch user data:", response.statusText);
       }
     } catch (error) {
      if (error.message === "rate-limited ") {
        navigate("/");
      }
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
const handleUpdateSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = Cookies.get("token");

    // prepare payload
    const payload = {
      title: photodetails.title,
      description: photodetails.description,
      tags: photodetails.tags.map(tag => tag.id), // ✅ only send IDs
    };

    const response = await fetch(
      `http://127.0.0.1:8000/api/updatephoto/${photodetails.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Photo updated successfully:", data);
      setShowEditModal(false); // close modal
      // refresh photo list
      setUserPhotos((prev) =>
        prev.map((p) => (p.id === photodetails.id ? data.photo : p))
      );
    } else {
      const errorData = await response.json();
      console.error("Failed to update photo:", errorData);
    }
  } catch (error) {
    console.error("Error updating photo:", error);
  }
};


  return (
    <>
    <Header/>
    {showEditModal && (
      <div className="modal-overlay" >
      {/* Modal Content */}
      <div className="modal-content" >
        {/* Close Button */}
        <button onClick={() => setShowEditModal(false)} className="close-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="modal-title">Update Photo Details</h2>
        <p className="modal-subtitle">Edit the information for your photo.</p>

        <div className="modal-body">
          {/* Left Side: Image Preview */}
          <div className="image-preview-container">
            <img
              src={photodetails.path}
              alt="Photograph to be updated"
              className="image-preview"
            />
          </div>

          {/* Right Side: Form Details */}
          <div className="form-details">
            {/* Title Input */}
            <input
              type="text"
              defaultValue="Golden Hour at the Lake"
              onChange={(e) => setPhotodetails({ ...photodetails, title: e.target.value })}
              value={photodetails.title}
              className="title-input"
            />

            {/* Category Checkboxes */}
         {/* Category Checkboxes */}
<div className="category-grid">
  {categories.map((category) => (
    <label key={category.id} className="category-label">
      <input
        type="checkbox"
        className="checkbox-input"
        checked={photodetails.tags.some((tag) => tag.id === category.id)} // ✅ pre-check if tag is in photodetails.tags
        onChange={(e) => {
          if (e.target.checked) {
            // add tag
            setPhotodetails((prev) => ({
              ...prev,
              tags: [...prev.tags, category],
            }));
          } else {
            // remove tag
            setPhotodetails((prev) => ({
              ...prev,
              tags: prev.tags.filter((tag) => tag.id !== category.id),
            }));
          }
        }}
      />
      <span className="checkbox-custom">
        <svg
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 18.0003L3.63574 11.6364L5.04996 10.2222L9.9997 15.1709Z"></path>
        </svg>
      </span>
      <span className="category-text">{category.name}</span>
    </label>
  ))}
</div>


            {/* Save Button */}
            <button className="save-button" onClick={handleUpdateSubmit}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
    )

    }
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
        <button className="photo-btn update-btn" onClick={() => handleEdit(photo.id)}><AiOutlineEdit />
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
