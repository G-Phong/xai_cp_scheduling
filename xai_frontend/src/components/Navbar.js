import React from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";

function Navbar() {
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
            Pop-Up-Schedule
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/what-if" className="nav-link">
            What-If Analysis
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/edugame" className="nav-link">
            EduGame
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/quiz" className="nav-link">
            AI Quiz
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/faq" className="nav-link">
            FAQ
          </Link>
        </li>
{/*         <li className="nav-item">
          <Link to="/randomButton" className="nav-link">
            Random Button
          </Link>
        </li> */}
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
