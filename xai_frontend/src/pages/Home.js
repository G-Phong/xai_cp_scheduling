import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

export default function Home() {
  return (
    <div className="container mt-5">
      <h1 className="display-4 text-primary text-center">
        Welcome to CP-Based Shift Scheduling Explanatory Model
      </h1>
      <p className="lead text-center">
        In this project, we aim to enhance the transparency and interpretability
        of our COP-based shift scheduling algorithm through Explainable
        Artificial Intelligence (XAI) techniques.
      </p>

      <div className="home-section">
        <h2 className="text-primary">Project Overview</h2>
        <p>
          Our project focuses on creating an Explanatory Model for a Constraint
          Optimization Problem (COP) - based shift scheduling algorithm. The
          primary goal is to make the algorithm more understandable to humans and
          increase trust in the AI system.
        </p>
      </div>

      <div className="home-section">
        <h2 className="text-primary">Key Features</h2>
        <ul>
          <li>User-Friendly Explanations: We provide clear and user-friendly
            explanations for the shift scheduling decisions made by our AI system.</li>
          <li>Cognitive Psychology Principles: Our explanations are designed based
            on principles from cognitive psychology to ensure they are effective and
            easy to understand.</li>
          <li>Enhanced Transparency: By using XAI techniques, we aim to
            enhance the transparency of the AI-based scheduling process.</li>
        </ul>
      </div>

      <div className="home-section">
        <h2 className="text-primary">How It Works</h2>
        <p>
          Our Explanatory Model leverages XAI methodologies to generate
          explanations for the shift scheduling results. It takes into account
          various factors, including employee preferences, job requirements, and
          organizational constraints, to produce optimized shift plans.
        </p>
      </div>

      <div className="home-section">
        <h2 className="text-primary">Why It Matters</h2>
        <p>
          The transparency and interpretability of AI systems are crucial,
          especially in applications like shift scheduling, where human well-being
          and fairness are at stake. Our project addresses these concerns by
          providing insights into the decision-making process.
        </p>
      </div>

      <div className="home-section">
        <h2 className="text-primary">Get Started</h2>
        <p>
          To explore our COP-Based Shift Scheduling Explanatory Model, navigate to
          the <Link to="/schedule" className="btn btn-primary">Schedule</Link> section to view the shift plans and explanations.
        </p>
      </div>

      <div className="home-section">
        <h2 className="text-primary">Contact Us</h2>
        <p>
          If you have any questions or feedback, please feel free to contact us at{" "}
          <a href="mailto:gia-phong.tran@tum.de">gia-phong.tran@tum.de</a> or go to <Link to="/about-us" className="btn btn-primary">About Us</Link>.
        </p>
      </div>
    </div>
  );
}
