import React, { useEffect, useRef } from "react";
import Quiz from "./Quiz.js";
import FAQ from "./FAQ.js";
import { useLocation } from "react-router-dom";

import "./TheoryClassroom.css";

export default function TheoryClassroom() {
  const faqRef = useRef(null);
  const quizRef = useRef(null);

  const location = useLocation();

    // Scroll to top on mount,  the empty array ensures it only runs once on mount
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  

  const handleScroll = () => {
    const hash = window.location.hash;
    console.log("Hash:");
    console.log(hash);
    if (hash === "#faq" && faqRef.current) {
      faqRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (hash === "#quiz" && quizRef.current) {
      quizRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    handleScroll();
  }, [location.hash]);

  return (
    <div className="theory-classroom-container">
      <section ref={faqRef} id="faq" className="faq-section">
        <FAQ />
      </section>

      <section ref={quizRef} id="quiz" className="quiz-section">
        <Quiz />
      </section>
    </div>
  );
}
