import React, { useEffect } from "react";
import WeekView from "../components/WeekView.js";
// Import SVG as a component (if using SVGR/Webpack)
import { ReactComponent as Infographic } from "../Images_Infographics/XAI_How_it_works.svg";

import { Link } from "react-router-dom"; // Assuming you are using react-router for navigation

import "./Schedule.css";

export default function Schedule() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // The empty array ensures it only runs once on mount

  return (
    <div className="schedule-container">
      <Infographic className="infographic" /> {/* SVG component with class */}
      {/* Overlay buttons using Bootstrap classes */}
      <div className="buttons-container">
        <Link to="/what-if" className="btn info what-if-button">
          What-If Scenarios
        </Link>
        <Link to="/edugame" className="btn info game-button">
          Educational Game
        </Link>
        <Link to="/theory" className="btn info classroom-button">
          Theory Classroom
        </Link>
      </div>
      {/* <WeekView/> */}
    </div>
  );
}
