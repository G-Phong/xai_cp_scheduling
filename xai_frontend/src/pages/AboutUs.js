import React from "react";

import "./AboutUs.css";


export default function AboutUs() {
  return (
    <div className="container mt-5 text-center">
      <div className="row">
        <div className="col-md-12">
          <h1>About Us</h1>
          <p>
            Welcome to the "Explainify.AI" project! We are a team of dedicated
            individuals passionate about improving the transparency and
            interpretability of AI systems.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <h2>Our Team</h2>
          <ul>
            <li>
              <strong>Charlotte Haid, M.Sc.</strong> - Project Advisor
              <br />
              Charlotte is a researcher at the Chair of Materials Handling,
              Material Flow, and Logistics (Prof. Fottner) at TUM. She is
              involved in the HPAO project, focusing on developing an allocation
              system that considers employee preferences and addresses various
              ethical challenges in process optimization. If your company is
              interested in collaborating on the HPAO research project, you can
              contact her at{" "}
              <a href="mailto:charlotte.haid@tum.de">charlotte.haid@tum.de</a>.
              Learn more about the HPAO project{" "}
              <a href="https://www.mec.ed.tum.de/fml/forschung/2022/hpao-ein-menschliches-praeferenzen-einbeziehendes-optimierungssystem/">
                here
              </a>
              .
            </li>
            <li>
              <strong>Gia-Phong Tran</strong> - M.Sc. Mechatronics and Robotics
              <br />
              Gia-Phong is currently pursuing a Master's degree in Mechatronics
              and Robotics at TUM and is working on his Master's thesis within
              the HPAO project. You can connect with him on{" "}
              <a href="https://www.linkedin.com/in/gia-phong-tran-480577196/">
                LinkedIn
              </a>
              .
            </li>
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <h2>Our Mission</h2>
          <p>
            Our mission is to enhance the transparency and interpretability of
            AI systems, making them more accessible and trustworthy for all
            users.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <h2>Contact Us</h2>
          <p>
            If you have any questions or feedback, please feel free to contact
            us at{" "}
            <a href="mailto:gia-phong.tran@tum.de">gia-phong.tran@tum.de</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
