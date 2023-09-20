import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Importiere Bootstrap-CSS
import "./FAQ.css"; // Importiere Ihre CSS-Datei

function FAQ() {
  // FAQ-Daten mit Fragen und Antworten
  const faqData = [
    {
      question: "Wie kann ich meine Schichtpräferenzen im System hinterlegen?",
      answer:
        "Bevor die Schichtplanung beginnt, haben Sie die Möglichkeit, Ihre Präferenzen über ein Benutzerinterface einzugeben. Dort können Sie für jeden Schichttyp eine Bewertung von 0-100 abgeben, wobei 100 die höchste Präferenz darstellt.",
    },
    {
      question:
        "Wann ist der Zeitpunkt, meine Präferenzen für die Schichtplanung anzugeben?",
      answer:
        "Präferenzen sollten idealerweise bis zu einer festgelegten Frist vor der eigentlichen Schichtplanerstellung angegeben werden. Details zur Fristfindung entnehmen Sie bitte den betriebsinternen Kommunikationskanälen.",
    },
    {
      question:
        "Wie kann ich nach der Schichtplanerstellung Feedback zum Plan geben?",
      answer:
        "Nachdem der Schichtplan erstellt wurde, gibt es eine Feedback-Phase. Sie können Ihr Feedback direkt über das System einreichen. Dort ist ein Bereich vorgesehen, in dem Sie Anmerkungen und Bewertungen zu den zugewiesenen Schichten abgeben können.",
    },

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
      question: "Wie wurden meine persönlichen Präferenzen berücksichtigt?",
      answer:
        "Ihre persönlichen Präferenzen werden im Vorfeld der Schichtplanerstellung erfasst und als weiche Bedingungen in den Algorithmus eingebracht. Diese weichen Bedingungen beeinflussen die Optimierungsentscheidung, wobei allerdings Kompromisse mit anderen Faktoren, wie z.B. betrieblichen Anforderungen und Präferenzen anderer Mitarbeiter, gemacht werden können. Das Erklärmodell beinhaltet zudem ein What-if-Tool, mit dem Sie Ihre individuellen Präferenzen modifizieren können. Das Tool zeigt Ihnen in Echtzeit die Auswirkungen Ihrer Änderungen auf den Schichtplan und weitere relevante Metriken.",
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
    {
      question:
        "Wie werden rechtliche und betriebliche Anforderungen berücksichtigt?",
      answer:
        " Der Algorithmus ist darauf ausgelegt, sämtliche rechtliche Vorgaben und betriebliche Richtlinien, wie etwa maximale Arbeitszeiten oder gesetzliche Pausen, als harte Bedingungen zu berücksichtigen. Diese werden in der Optimierung priorisiert.",
    },
    {
      question:
        "Wie wird der Algorithmus mit Konflikten umgehen, bei denen mehrere Mitarbeiter die gleiche Schicht bevorzugen?",
      answer:
        "In solchen Fällen führt der Algorithmus eine Optimierung durch, um den Konflikt so fair wie möglich zu lösen. Dabei werden auch weiche Bedingungen und andere Metriken berücksichtigt.",
    },
    {
      question:
        "Wie können Mitarbeiter ihr Feedback und ihre Präferenzen in den Prozess einbringen?",
      answer:
        "Vor der Erstellung des Schichtplans können Mitarbeiter ihre Präferenzen für bestimmte Jobs auf einer Skala von 0 bis 100 angeben. Nach der Schichtplanerstellung besteht zudem die Möglichkeit, Feedback zum erhaltenen Plan abzugeben.",
    },
    {
      question:
        "Kann der Algorithmus meine längerfristigen Wünsche berücksichtigen, z.B. wenn ich weiß, dass ich in einem bestimmten Monat mehr Freizeit möchte?",
      answer:
        "Derzeit ist diese Funktionalität noch nicht implementiert, jedoch ist es geplant, solche längerfristigen Wünsche in zukünftigen Updates des Algorithmus zu berücksichtigen.",
    },
    {
      question:
        "Wie beeinflussen Krankmeldungen oder plötzliche Abwesenheiten den Schichtplan?",
      answer:
        "Krankmeldungen oder plötzliche Abwesenheiten lösen eine erneute Optimierung des Schichtplans aus, um die Auswirkungen auf das Gesamtsystem zu minimieren.",
    },
    {
      question:
        "Gibt es eine Möglichkeit, den Algorithmus zu trainieren, um besser auf die speziellen Bedürfnisse unseres Betriebs einzugehen?",
      answer:
        "Das Erklärmodell enthält Mechanismen für ein fortlaufendes Feedback, welches zur Feinjustierung des Algorithmus verwendet werden kann. Dadurch kann der Algorithmus zunehmend besser auf die spezifischen Anforderungen des Betriebs eingehen.",
    },
    {
      question:
        "Wie schnell kann der Algorithmus auf plötzliche Änderungen reagieren?",
      answer:
        "Der Algorithmus ist so konzipiert, dass er schnell auf Änderungen reagieren kann. Die genaue Reaktionszeit hängt von der Komplexität des Problems und den zur Verfügung stehenden Rechenressourcen ab.",
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
