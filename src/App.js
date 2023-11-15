import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import CustomNavbar from "./components/Navbar.js";
import Schedule from "./pages/Schedule.js";
import WhatIfAnalysis from "./pages/WhatIfAnalysis.js";
import EduGame from "./pages/EduGame.js";
import TheoryClassroom from "./pages/TheoryClassroom.js";
import Visualization from "./pages/Visualization.js";
import LandingPage from "./pages/LandingPage.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export default function App() {
  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-2 d-none d-md-block bg-dark sidebar sticky-top">
          <CustomNavbar />
        </nav>

        <main role="main" className="col-md-10 ml-sm-auto main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/visual" element={<Visualization />} />
            <Route path="/what-if" element={<WhatIfAnalysis />} />
            <Route path="/edugame" element={<EduGame />} />
            <Route path="/theory" element={<TheoryClassroom />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
