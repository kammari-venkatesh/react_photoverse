import React from 'react';

// To apply the styles, make sure to link to 'index.css' in your main HTML file.
// Also, add the 'rate-limiter-body' class to your <body> tag for the background.
import './index.css';
const RateLimiter = () => {
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
        <button className="retry-button">Retry</button>
      </div>
      <p className="footer-text">© 2025 PhotoVerse</p>
    </div>
  );
};

export default RateLimiter;