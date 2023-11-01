import React from "react";
import { Link } from "react-router-dom";
import { animateScroll as scroll, Link as ScrollLink } from "react-scroll";

import "./Navbar.css";

function Navbar() {
  // Funktion, um das Dropdown zu öffnen/schließen
  const toggleDropdown = (event) => {
    const dropdownMenu = event.currentTarget.nextElementSibling;
    dropdownMenu.classList.toggle("show");
  };

  return (
    <nav className="navbar navbar-dark bg-dark text-center sticky-top">
       <Link to="/home" className="navbar-brand mb-0 h1">Scheduling.AI</Link>
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
            <Link to="/visual" className="dropdown-item">
              Visualization
            </Link>
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
            {/*             <ScrollLink
              to="faq"
              smooth={false}
              duration={300}
              className="dropdown-item"
            >
              FAQ
            </ScrollLink>
            <ScrollLink
              to="quiz"
              smooth={false}
              duration={300}
              className="dropdown-item"
            >
              AI Knowledge Quiz
            </ScrollLink> */}
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
  );
}

export default Navbar;
