import "./LandingPage.css";
import ai_brain from "../Img/ai_brain.jpg";
import calendar_black from "../Img/calendar_black.png";
import xai from "../Img/XAI.jpg";
import phong from "../Img/phong.jpg";
import charlotte from "../Img/charlotte.jpg"

import calendar_zoom from "../Img/calendar_zoom.jpg";
import coffee_spill from "../Img/coffee_spill.jpg";
import holding_calendar from "../Img/holding_calendar.jpg";
import pencil_book from "../Img/pencil_book.jpg";
import smartphone_hand from "../Img/smartphone_hand.jpg";
import thumbs_up_down from "../Img/thumbs_up_down.jpg";
import fml_logo from "../Img/FML_logo.jpg";

import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export default function LandingPage() {
  const featuresRef = useRef(null);
  const getStartedRef = useRef(null);
  const contactRef = useRef(null);
  const location = useLocation();
  

  const handleScroll = () => {
    const hash = window.location.hash;
    console.log("Hash:");
    console.log(hash);
    if (hash === "#features" && featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (hash === "#getStarted" && getStartedRef.current) {
      getStartedRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (hash === "#contact" && contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    handleScroll();
  }, [location.hash]);

  return (
    <div className="App">
      {/* <!--SECTION HERO BLOG START--> */}
      <section class="hero">
        <div class="container">
          <div class="left-col">
            <p class="sub-head">Explainify.AI </p>
            <h1>A Scheduling AI made understandable</h1>

            <div class="hero-cta">
              <a href="#features" class="primery-cta">
                Features
              </a>
              <a href="#getStarted" class="primery-cta">
                Get Started
              </a>
              <a href="#contact" class="primery-cta">
                Contact
              </a>
            </div>
          </div>

          <img src={calendar_black} alt="Illustration" class="hero-img" />
        </div>
      </section>
      {/* <!--SECTION HERO BLOG END--> */}

      {/* <!--SECTION FEATURES BLOG START--> */}
      <section ref={featuresRef} class="features-section">
        <div class="container">
          <h1>Features</h1>
          <ul>
            <li>An Explainable Artificial Intelligence approach</li>
            <li> Understand the Shift Scheduling AI </li>
            <li>Explanations made for humans</li>
            <li>Easily interpretable visualizations</li>
            <li>Compare your schedule to the one of the AI</li>
            <li>Gamification: Play around with the schedule</li>
            <li>Explore & Interact</li>
          </ul>
          <img src={xai} alt="xai" />
        </div>
      </section>
      {/* <!--SECTION FEATURES BLOG END--> */}

      {/* <!--SECTION GET STARTED START--> */}
      <section ref={getStartedRef} className="get-started-section">
        <div className="container">
          <h2>Two approaches to shift planning</h2>

          <div className="info-section">
            <div className="steps-section">
              <span class="label-left">Manual approach</span>
              <div className="step">
                <img src={pencil_book} alt="TUM Logo" />
                <h4>1. Manual Planning</h4>
                <p>
                  A shift supervisor spends hours creating the shift schedule.
                  It is a complicated and tedious task.
                </p>
              </div>
              <div className="step">
                <img src={calendar_zoom} alt="TUM Logo" />
                <h4>2. Ineffective Schedules</h4>
                <p>
                  Despite the efforts, there are conflicts and dissatisfaction
                  among the employees.
                </p>
              </div>
              <div className="step">
                <img src={coffee_spill} alt="TUM Logo" />
                <h4>3. Dissatisfaction</h4>
                <p>
                  Often, not all resources are used optimally and employee
                  preferences are not well respected, leading to mediocre
                  schedules.
                </p>
              </div>
            </div>
          </div>

          {/* Beginn der zweiten 3er-Reihe */}
          <div className="info-section">
            <div className="steps-section">
              <span class="label-left">
                Planning with Artificial Intelligence
              </span>
              <div className="step">
                <img src={thumbs_up_down} alt="TUM Logo" />
                <h4>1. Data Collection</h4>
                <p>
                  Employees enter their work preferences into a system,
                  installed on their phones as an App.
                </p>
              </div>
              <div className="step">
                <img src={smartphone_hand} alt="TUM Logo" />
                <h4>2. Preferences</h4>
                <p>
                  The system takes into account all preferences and respects
                  them all.
                </p>
              </div>
              <div className="step">
                <img src={holding_calendar} alt="TUM Logo" />
                <h4>3. Optimal Schedules</h4>
                <p>
                  The system ensures that all shifts are optimally staffed and
                  employees having a satisfactory work schedule.
                </p>
              </div>
            </div>
          </div>
          {/* Ende der zweiten 3er-Reihe */}
          <br />
          <br />
          {/*           <h2>Learn how it works! </h2>
          <Link to="/schedule" className="get-started-btn">Get Started</Link> */}

          <Link to="/schedule" className="getstarted-button">
            <div className="icon">➡️</div> {/* 📅☑️ */}
            <div className="text">Get Started</div>
          </Link>
        </div>
      </section>
      {/* <!--SECTION GET STARTED END--> */}

      {/* <!--SECTION TESTIMONIALS & CONTACT START--> */}
      <section ref={contactRef} class="test-monials-section container-flex">
        <div class="container">
          {/* <h1> People </h1> */}
          <ul>
            <li className= "testimonials-li">
              {/* <!--Phong Image--> */}
              <img src={phong} alt="Phong" />
              <blockquote>
              <br/>
              Initiated 'Explainify.AI' to improve transparency and trust in AI technologies across diverse user groups. Specialized in AI-driven shift scheduling algorithms and creating user-friendly interfaces. Started my master's thesis journey at the FML chair in the summer of 2023.
               </blockquote>
              <cite> &mdash; Gia-Phong Tran <br />
                TUM Master's student</cite> <br />
              <a href="mailto:giaphong.tran@tum.de">giaphong.tran@tum.de</a>
            </li>

            <li>
              {/* <!--TUM-LOGO--> */}
              <img src={charlotte} alt="fml" />
              <blockquote>
                <br/>
                A Research Associate at the Chair of Material Handling, Material Flow, and Logistics (FML) at TU Munich. Since mid-2020, her research interests at the chair have expanded to include the future of work, robotics, and the societal impact of technological innovations in manufacturing.
             </blockquote>
              <cite> &mdash; Charlotte Haid <br />
                FML researcher and <br />
                Master thesis supervisor </cite> <br />
              <a href="mailto:charlotte.haid@tum.de">charlotte.haid@tum.de</a>
            </li>
          </ul>
        </div>

        <div className="container">
          <h2>Contact Information</h2>

          <div className="contact-item">
            <strong>Address:</strong> Technische Universität München <br />
            Boltzmannstraße 15 <br />
            85748 Garching bei München
          </div>
          <div className="contact-item">
            <strong>Phone:</strong> +49.89.289.15921
          </div>
          <div className="contact-item">
            <strong>Email:</strong>{" "}
            <a href="mailto:kontakt.fml@ed.tum.de">kontakt.fml@ed.tum.de</a>{" "}
            <br />
          </div>
          <div className="contact-item">
            <strong>Website:</strong>{" "}
            <a
              href="http://www.mec.ed.tum.de/fml"
              target="_blank"
              rel="noopener noreferrer"
            >
              Technische Universität München - fml
            </a>
          </div>
          {/* You can add more details from the provided contact info here */}
        </div>
      </section>
      {/* <!--SECTION TESTIMONIALS & CONTACT END--> */}
    </div>
  );
}
