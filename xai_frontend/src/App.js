import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CustomNavbar from "./components/Navbar.js";
import Home from "./pages/Home.js";
import FAQ from "./pages/FAQ.js";
import Schedule from "./pages/Schedule.js";
import WhatIfAnalysis from "./pages/WhatIfAnalysis.js";
import Quiz from "./pages/Quiz.js";
import EduGame from "./pages/EduGame.js";
import AboutUs from "./pages/AboutUs.js";
import Visualization from "./pages/Visualization.js";
import LandingPage from "./pages/LandingPage.js"

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export default function App() {
  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-2 d-none d-md-block bg-dark sidebar">
          <CustomNavbar />
        </nav>

        <main role="main" className="col-md-10 ml-sm-auto px-4 main-content">
          <Routes>
          <Route path="/" element={<Home />} />
            {/* <Route path="/home" element={<Home />} /> */}
            <Route path="/home" element={<LandingPage/>} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/visual" element={<Visualization />} />
            <Route path="/what-if" element={<WhatIfAnalysis />} />
            <Route path="/edugame" element={<EduGame />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/faq" element={<FAQ />} />
            {/* <Route path="/about-us" element={<AboutUs />} /> */}
          </Routes>
        </main>
      </div>
    </div>
  );
}
