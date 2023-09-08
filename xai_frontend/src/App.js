//React Libraries
import React, { useEffect, useState } from "react";
import axios from "axios"; //JavaScript Library für HTTP-Anfragen
import { Route, Router, Routes } from "react-router-dom"; //Router-Library

//App.css Stylesheet
//import "./App.css";

//Components
import Navbar from "./components/Navbar.js"; // Navigationsleiste NavBar

//Pages
import Home from "./pages/Home.js"; // Home-Page
import FAQ from "./pages/FAQ.js"; // FAQ-Page
import RandomButton from "./pages/RandomButton.js"; // RandomButton-Page
import Schedule from "./pages/Schedule.js"; // Schedule-Page
import Quiz from "./pages/Quiz.js"; // Quiz-Page
import EduGame from "./pages/EduGame.js"; // EduGame-Page
import AboutUs from "./pages/AboutUs.js"; // Schedule-Page

// Hauptfunktionskomponente App
function App() {
  
  return (
    <div className="App">
      <Navbar />

      <div className="container">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/edugame" element={<EduGame />} />
          <Route path="/Lernquiz" element={<Quiz />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/randomButton" element={<RandomButton />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </div>
    
    </div>
  );
}

//Die App-Komponente wird exportiert, damit sie in anderen Dateien verwendet werden kann.
export default App;
