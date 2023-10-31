/* eslint-disable jsx-a11y/anchor-is-valid */
import "./LandingPage.css";
import ai_brain from "../Img/ai_brain.jpg";
import calendar_black from "../Img/calendar_black.png";
import TUM_eng_logo from "../Img/TUM_Logo_extern_mt_EN_RGB_p.png";
import phong from "../Img/phong.jpg";

function LandingPage() {
  return (
    <div className="App">
      {/* <!--SECTION HERO BLOG START--> */}
      <section class="hero">
        <div class="container">
          <div class="left-col">
            <p class="sub-head">Explainify.AI </p>
            <h1>A Scheduling AI made understandable</h1>

            <div class="hero-cta">
              <a href="#" class="primery-cta">
                Get Started
              </a>
            </div>
          </div>

          <img src={calendar_black} alt="Illustration" class="hero-img" />
        </div>
      </section>
      {/* <!--SECTION HERO BLOG END--> */}

      {/* <!--SECTION FEATURES BLOG START--> */}
      <section class="features-section">
        <div class="container">
          <ul>
            <li>Explainable AI for Scheduling: An explanation model</li>
            <li>End-user Centric Explanations: Made for humans</li>
            <li>Visualization Tools: Easily interpret AI decisions</li>
            <li>Transparent AI Process: Insights into scheduling process</li>
            <li>Preference-Awareness: The AI respects shift preferences</li>
            <li>Explore & Interact: A hands-on approach</li>
          </ul>
        </div>
        <img src={ai_brain} alt="phone" />
      </section>
      {/* <!--SECTION FEATURES BLOG END--> */}

      {/* <!--SECTION TEST  BLOG START--> */}
      <section class="test-monials-section">
        <div class="container">
          <ul>
            {/* <!--Phong--> */}
            <li>
              <img src={phong} alt="Person 1" />
              <blockquote>
                Meet the driving force behind 'Explainify.AI'. The goal? Making
                AI accessible and trusted by all.
              </blockquote>
              <cite> &mdash; Gia-Phong Tran (TUM Master's student)</cite>
            </li>

            {/* <!--TUM-LOGO--> */}
            <li>
              <img src={TUM_eng_logo} alt="TUM  " />
              <blockquote>
                The Technical University of Munich, particularly the Chair of
                Materials Handling, Material Flow, and Logistics (FML), is a
                pioneer in logistics research and education. Their key areas of
                focus range from robotics to sustainable logistics. They not
                only envision the future of logistics but also play an active
                role in shaping it.
              </blockquote>
              <cite> &mdash; Charlotte Haid (FML researcher)</cite>
            </li>
          </ul>
        </div>
      </section>
      {/* <!--SECTION TEST  BLOG END--> */}

      {/* <!--SECTION GET STARTED START--> */}
      <section class="get-started-section">
        <div class="container">
          <h2>Get Started</h2>
          <p> Hier erklären Sie, wie die Seite funktioniert. </p>
          {/* Hier können Sie weitere Inhalte oder Elemente hinzufügen. */}
        </div>
      </section>
      {/* <!--SECTION GET STARTED END--> */}
    </div>
  );
}

export default LandingPage;
