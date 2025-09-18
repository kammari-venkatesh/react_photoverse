import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './index.css';
import {Link} from 'react-router';
const RateLimiter = () => {
  const [timer, setTimer] = useState(40)
  const navigate = useNavigate();

  useEffect(() => {
    if (timer <= 0) {
      navigate('/home', { replace: true });
      return; // Stop when timer hits 0
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [timer]);

  return (
    <div className="rate-limiter-page">
      <div className="rate-limiter-card">
        <div className="icon-container">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#38bdf8"
            strokeWidth="1.5"
            className="hourglass-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.75 19.5h-13.5a.75.75 0 01-.75-.75v-13.5a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 7.5h13.5M5.25 16.5h13.5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 7.5s-4.5 3.75-4.5 3.75S7.5 7.5 7.5 7.5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 16.5s-4.5-3.75-4.5-3.75S7.5 16.5 7.5 16.5"
            />
          </svg>
        </div>
        <h1 className="title">Too Many Requests</h1>
        <p className="subtitle">
          You've made too many requests in a short time. Please wait and try
          again later.
        </p>
        <h2 className="suggestion-title">Try again after: {timer} seconds</h2>
        <Link to="/home">
          <button className="retry-button">Retry</button>
        </Link>
      </div>
      <p className="footer-text">© 2025 PhotoVerse</p>
    </div>
  );
};

export default RateLimiter;