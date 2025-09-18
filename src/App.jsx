import React from "react";
import './App.css';
import { BrowserRouter,Routes,Route } from "react-router";
import PhotoVerseLogin from "./Components/Loginorsignup/Loginorsignup";
import Home from "./Components/Home/Home";
import Explorepage from "./Components/Explorepage/Explorepage";
import Uploadpage from "./Components/Uploadpage/Uploadpage";
import Profilesection from "./Components/Profilesection/Profilesection";
import PhotoCard from "./Components/detailedpage/Photocard";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import RateLimiter from "./Components/Ratelimit/RateLimiter";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<PhotoVerseLogin/>}/>
        <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path="/explore" element={<ProtectedRoute><Explorepage/></ProtectedRoute>}/>
        <Route path="/upload" element={<ProtectedRoute><Uploadpage/></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Profilesection/></ProtectedRoute>}/>
        <Route path="/photo/:id" element={<ProtectedRoute><PhotoCard/></ProtectedRoute>}/>
        <Route path="/ratelimiter" element={<RateLimiter />} />
      </Routes>
    </BrowserRouter>
    
  );
}