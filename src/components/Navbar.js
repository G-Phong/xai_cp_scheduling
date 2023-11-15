import React from "react";
import { Link } from "react-router-dom";
import TUM_logo from "../Img/TUM_Logo_extern_mt_EN_RGB_p.png";
import fml_logo from "../Img/FML_logo.jpg";
import youtube_logo from "../Img/youtube_logo.jpg";
import linkedin_logo from "../Img/linkedin_logo.jpg";

import "./Navbar.css";

function Navbar() {
  // Funktion, um das Dropdown zu öffnen/schließen
  const toggleDropdown = (event) => {
    const dropdownMenu = event.currentTarget.nextElementSibling;
    dropdownMenu.classList.toggle("show");
  };

  return (
    <div className="navbar-container">
      <nav className="navbar navbar-dark bg-dark text-center sticky-top">
        <Link to="/home" className="navbar-brand mb-0 h1">
          Scheduling.AI
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/home" className="nav-link">
              Welcome
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/schedule" className="nav-link">
              Get started: How It Works
            </Link>
          </li>
          <li className="nav-item dropdown">
            <div className="nav-link dropdown-toggle" onClick={toggleDropdown}>
              Compare & Understand
            </div>
            <div className="dropdown-menu">
              <Link to="/what-if" className="dropdown-item">
                What-If Scenarios
              </Link>
       {/*        <Link to="/visual" className="dropdown-item">
                Visualization
              </Link> */}
            </div>
          </li>
          <li className="nav-item dropdown">
            <div className="nav-link dropdown-toggle" onClick={toggleDropdown}>
              Interactive Learning Game
            </div>
            <div className="dropdown-menu">
              <Link to="/edugame" className="dropdown-item">
                Educational Game
              </Link>
            </div>
          </li>
          <li className="nav-item dropdown">
            <div className="nav-link dropdown-toggle" onClick={toggleDropdown}>
              Theory Classroom
            </div>
            <div className="dropdown-menu">
              <Link to="/theory#faq" className="dropdown-item">
                FAQ
              </Link>
              <Link to="/theory#quiz" className="dropdown-item">
                AI Knowledge Quiz
              </Link>
            </div>
          </li>
        </ul>
      </nav>
      <div className="follow-container">
        <p>Follow TUM-fml</p>
        <a
          href="https://www.youtube.com/channel/UCGyJbsCXrvbx8Xxl9_RNk4g"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={youtube_logo} alt="YouTube Logo" className="social-icon" />
        </a>
        <a
          href="https://www.linkedin.com/company/tum-fml/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={linkedin_logo}
            alt="LinkedIn Logo"
            className="social-icon"
          />
        </a>
      </div>
      {/* Now add the logos (outside the navbar element) */}
      <div className="uni-logo-wrapper">
        <a
          href="https://www.mec.ed.tum.de/en/fml/cover-page/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={fml_logo} alt="FML Logo" className="uni-logo" />
        </a>
        <a href="https://www.tum.de/" target="_blank" rel="noopener noreferrer">
          <img src={TUM_logo} alt="TUM Logo" className="uni-logo" />
        </a>
      </div>
    </div>
  );
}

export default Navbar;
