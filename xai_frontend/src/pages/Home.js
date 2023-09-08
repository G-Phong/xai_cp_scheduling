import "./Home.css";
import { Link } from "react-router-dom"; // Importiere die Link-Komponente

export default function Home() {
  return (
    <div>
      <h1>
        Welcome to CP-Based Shift Scheduling Explanatory Model
      </h1>
      <p>
        In this project, we aim to enhance the transparency and interpretability
        of our COP-based shift scheduling algorithm through Explainable
        Artificial Intelligence (XAI) techniques.
      </p>

      {/* Verwende Link-Komponenten, um auf die Routen zu verlinken */}
      <home-h2><Link to="/home">Project Overview</Link></home-h2>
      <p>
        Our project focuses on creating an Explanatory Model for a Constraint
        Optimization Problem (COP) - based shift scheduling algorithm. The
        primary goal is to make the algorithm more understandable to humans and
        increase trust in the AI system.
      </p>

      <home-h2>Key Features</home-h2>
      <p>
        - User-Friendly Explanations: We provide clear and user-friendly
        explanations for the shift scheduling decisions made by our AI system.
        <br />
        - Cognitive Psychology Principles: Our explanations are designed based
        on principles from cognitive psychology to ensure they are effective and
        easy to understand.
        <br />- Enhanced Transparency: By using XAI techniques, we aim to
        enhance the transparency of the AI-based scheduling process.
      </p>

      <home-h2>How It Works</home-h2>
      <p>
        Our Explanatory Model leverages XAI methodologies to generate
        explanations for the shift scheduling results. It takes into account
        various factors, including employee preferences, job requirements, and
        organizational constraints, to produce optimized shift plans.
      </p>

      <home-h2>Why It Matters</home-h2>
      <p>
        The transparency and interpretability of AI systems are crucial,
        especially in applications like shift scheduling, where human well-being
        and fairness are at stake. Our project addresses these concerns by
        providing insights into the decision-making process.
      </p>

      <home-h2>Get Started</home-h2>
      <p>
        To explore our COP-Based Shift Scheduling Explanatory Model, navigate to
        the <Link to="/schedule">Schedule</Link> section to view the shift plans and explanations.
      </p>

      <home-h2><Link to="/about-us">Contact Us</Link></home-h2>
      <p>
        If you have any questions or feedback, please feel free to contact us at{" "}
          <a href="mailto:gia-phong.tran@tum.de">gia-phong.tran@tum.de</a> or go to <Link to="/about-us">About Us</Link>.
      </p>
        
     </div>
  );
}



      

