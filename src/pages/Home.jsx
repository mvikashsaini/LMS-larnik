// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import './Home.css'; // Add your styles here

const Home = () => {

  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to the LMS</h1>
        <p>Browse and enroll in your favorite courses</p>
      </header>
        <div className="loading">
          <p>Loading courses...</p>
        </div>
        <div className="course-list">
            <p>No courses available at the moment.</p>
        </div>
    </div>
  );
};

export default Home;
