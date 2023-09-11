import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Importiere Bootstrap-CSS
import "./FAQ.css"; // Importiere Ihre CSS-Datei

function FAQ() {
  // FAQ-Daten mit Fragen und Antworten
  const faqData = [
    {
      question:
        "Was ist ein Bedingungserfüllungsproblem mit Optimierung (COP)?",
      answer:
        "Ein Bedingungserfüllungsproblem mit Optimierung (Constraint Optimization Problem, COP) ist ein Spezialfall eines Bedingungserfüllungsproblems (Constraint Satisfaction Problem, CSP). Im Gegensatz zum CSP, bei dem es lediglich darum geht, alle Bedingungen zu erfüllen, zielt ein COP darauf ab, eine Lösung zu finden, die nicht nur alle Bedingungen erfüllt, sondern auch eine Zielfunktion optimiert, beispielsweise die Minimierung von Überstunden oder die Maximierung der Mitarbeiterzufriedenheit.",
    },
    {
      question:
        "Was ist der Unterschied zwischen harten und weichen Bedingungen?",
      answer:
        "Harte Bedingungen sind nicht verhandelbar und müssen in jeder gültigen Lösung erfüllt sein. Beispiele sind gesetzliche Vorgaben oder notwendige Qualifikationen für bestimmte Schichten. Weiche Bedingungen sind flexibler und dienen der Optimierung. Sie können unter bestimmten Umständen vernachlässigt werden, etwa wenn dadurch eine bessere Gesamtlösung erreicht wird.",
    },
    {
      question:
        "Wie entscheidet der Algorithmus, welche Schicht einem Mitarbeiter zugewiesen wird?",
      answer:
        "Der Algorithmus verwendet eine Heuristik, die eine Kombination aus verschiedenen Faktoren wie Verfügbarkeit, Qualifikation und Präferenzen des Mitarbeiters sowie betrieblichen Anforderungen berücksichtigt. Durch die Optimierung der Zielfunktion wird versucht, eine gerechte und effiziente Schichtzuweisung zu erreichen.",
    },
    {
      question: "Warum erhalte ich nicht immer meine bevorzugte Schicht?",
      answer:
        "Die Zuweisung von Schichten ist ein komplexes Optimierungsproblem, das mehrere Randbedingungen und Präferenzen berücksichtigt. Obwohl Ihre Präferenzen im Algorithmus berücksichtigt werden, können andere Faktoren wie betriebliche Anforderungen oder die Präferenzen anderer Mitarbeiter dazu führen, dass Sie nicht immer Ihre bevorzugte Schicht erhalten.",
    },
    {
      question: "Kann der Algorithmus immer eine „gute“ Lösung finden?",
      answer:
        "Der Algorithmus zielt darauf ab, eine möglichst optimale Lösung zu finden. Allerdings kann die Qualität der Lösung durch verschiedene Faktoren wie die Komplexität des Problems, die Anzahl der Mitarbeiter und Schichten sowie die vorhandenen Ressourcen beeinflusst werden. Eine „gute“ Lösung ist daher relativ und hängt von den spezifischen Anforderungen und Beschränkungen ab.",
    },
  ];

  const [activeItems, setActiveItems] = useState(
    Array(faqData.length).fill(false)
  );

  const handleItemClick = (index) => {
    const newActiveItems = [...activeItems];
    newActiveItems[index] = !newActiveItems[index];
    setActiveItems(newActiveItems);
  };

  return (
    <div className="container">
      <h1 className="mt-5">FAQ</h1>
      {faqData.map((item, index) => (
        <div
          key={index}
          className={`accordion mb-3 ${activeItems[index] ? "show" : ""}`}
        >
          <div className="accordion-item">
            <h2 className="accordion-header" id={`faq-heading-${index}`}>
              <button
                className={`accordion-button ${
                  activeItems[index] ? "" : "collapsed"
                }`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#faq-collapse-${index}`}
                onClick={() => handleItemClick(index)}
              >
                {item.question}
              </button>
            </h2>
            <div
              id={`faq-collapse-${index}`}
              className={`accordion-collapse collapse ${
                activeItems[index] ? "show" : ""
              }`}
              aria-labelledby={`faq-heading-${index}`}
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">{item.answer}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FAQ;
