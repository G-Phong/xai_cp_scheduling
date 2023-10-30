import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <span className="navbar-brand mb-0 h1">Explainify.AI</span>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/home" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/schedule" className="nav-link">
            Weekly Schedule
          </Link>
        </li>
        <li className="nav-item">
          <div
            className={`nav-link ${dropdownOpen ? "active" : ""}`}
            onClick={toggleDropdown}
          >
            Compare & Understand
          </div>
          <div
            className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}
            onClick={toggleDropdown}
          >
            <Link to="/what-if" className="dropdown-item">
              What-If Scenarios
            </Link>
            <Link to="/visualization" className="dropdown-item">
              Visualization
            </Link>
          </div>
        </li>
        <li className="nav-item">
          <Link to="/edugame" className="nav-link">
            Interactive Learning Game
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/educational-game" className="nav-link">
            Educational Game
          </Link>
        </li>
        <li className="nav-item">
          <div
            className={`nav-link ${dropdownOpen ? "active" : ""}`}
            onClick={toggleDropdown}
          >
            Theory Classroom
          </div>
          <div
            className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}
            onClick={toggleDropdown}
          >
            <Link to="/ai-knowledge-quiz" className="dropdown-item">
              AI Knowledge Quiz
            </Link>
            <Link to="/faq" className="dropdown-item">
              FAQ
            </Link>
          </div>
        </li>
        <li className="nav-item">
          <Link to="/about-us" className="nav-link">
            About Us
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
