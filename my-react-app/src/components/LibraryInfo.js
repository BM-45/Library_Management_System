import React from 'react';
import './LibraryInfo.css';

function LibraryInfo() {
  return (
    <div className="library-info">
      <h2>Library Information</h2>
      <h3>Opening Hours</h3>
      <ul>
        <li>Monday - Friday: 9:00 AM - 8:00 PM</li>
        <li>Saturday: 10:00 AM - 6:00 PM</li>
        <li>Sunday: Closed</li>
      </ul> 
    </div>
  );
}

export default LibraryInfo;