import React, { useState } from "react";
import { Accordion, AccordionItem } from "react-accordion";

import "./FAQ.css"; // Import the CSS file

export default function FAQ() {
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (index) => {
    if (index === activeItem) {
      // Klick auf dasselbe Element, um es zu schließen
      setActiveItem(null);
    } else {
      // Klick auf ein anderes Element, um es zu öffnen
      setActiveItem(index);
    }
  };

  const faqItems = [
    { question: "Frage 1", answer: "Antwort auf Frage 1." },
    { question: "Frage 2", answer: "Antwort auf Frage 2." },
  ];

  return (
    <div>
      <h1>FAQ</h1>
      <Accordion>
        <AccordionItem
          title="Frage 1"
          expanded={activeItem === 0}
          onClick={() => handleItemClick(0)}
        >
          Antwort auf Frage 1.
        </AccordionItem>
        <AccordionItem
          title="Frage 2"
          expanded={activeItem === 1}
          onClick={() => handleItemClick(1)}
        >
          Antwort auf Frage 2.
        </AccordionItem>
        {/* Weitere Fragen und Antworten hier */}
      </Accordion>
    </div>
  );
}
