import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FAQ.css";

export default function FAQ() {
  // FAQ-Data with questions and answers
  const faqData = [
    {
      category: "Shift Scheduling System",
      items: [
        {
          question: "What is this website? And why?",
          answer: (
            <div className="pre-wrap">
              {`Scheduling.AI provides a platform to understand AI-based shift scheduling. It features:
   
What-If-Scenarios: Allows users to see how changes in preferences affect the schedule.

Educational Game: Lets users attempt to create schedules and compare with the AI results.

Theory Classroom: Includes a FAQ and an AI Quiz to check your knowledge.

These tools aim to give a clearer view of how AI helps in shift planning.`}
            </div>
          ),
        },
        {
          question:
            "How does the AI-based shift scheduling work? How can one use it?",
          answer:
            "Our AI-based shift scheduling system automates shift allocation efficiently, considering operational requirements, legal constraints, and employee preferences. It prioritizes individual employee needs while maintaining operational efficiency. Employees can set job preferences, and view their personal weekly schedule using the AI-generated solution.",
        },

        {
          question: "How can I enter my shift preferences in the system?",
          answer:
            "Before the shift planning begins, you have the opportunity to enter your preferences via a user interface. There you can give a rating from 0-100 for each type of shift, where 100 represents the highest preference.",
        },
        {
          question: "Is there a deadline for entering my preferences?",
          answer:
            "Yes, preferences should ideally be submitted by a set deadline, depending on the company regulations.",
        },
        {
          question: "Can I give feedback on the schedule?",
          answer:
            "Once the schedule has been created, there is a feedback phase. You can submit your feedback directly via the system.",
        },
        /*         {
          question:
            "How can employees incorporate their feedback and preferences into the process?",
          answer:
            "Before the creation of the shift plan, employees can state their preferences for specific jobs on a scale of 0 to 100. After the shift schedule has been created, there is also the opportunity to provide feedback on the received plan.",
        }, */
        {
          question:
            "How are legal and operational requirements taken into account?",
          answer:
            "The algorithm is designed to consider all legal requirements and operational guidelines, such as minimum and maximum working hours, as hard constraints. These MUST be respected in the solving process and the schedule.",
        },
      ],
    },
    {
      category: "About the AI Algorithm",
      items: [
        {
          question: "What is a Constraint Optimization Problem (COP)?",
          answer: (
            <div className="pre-wrap">
              {`Our shift scheduling problem is a so-called Constraint Optimization Problem.
A Constraint Optimization Problem (COP) involves finding the best outcome—like crafting the ideal schedule or planning a route—that follows certain rules, such as legal regulations or resource limits, while aiming to enhance a goal, like minimizing travel time or maximizing efficiency.

Constraints are used in everyday situations such as personal finance budgeting, urban planning, and even in organizing sports tournaments, where they help to navigate and balance various needs and wants.

A "solution" in this context refers to the end result that successfully meets all the rules while achieving the best possible outcome according to the goal, like a finalized budget plan or a completed tournament bracket. A solution can be obtained using a "Solver" (an algorithm/program, designed to solve this problem).
              `}
            </div>
          ),
        },
        {
          question: "How can you use software to solve such a problem?",
          answer: (
            <p>
              There are algorithms which are designed to solve Constraint Optimization Problems (see previous question).
              Our algorithm solves the shift scheduling problem by using a computational model (a software), developed by Google. 
              The software was developed by Google, as part of their{" "}
              <a
                href="https://developers.google.com/optimization/"
                target="_blank"
                rel="noopener noreferrer"
              >
                OR-Tools
              </a>
              , a powerful suite designed for solving complex computational problems.
            </p>
          ),
        },
   
        /*         {
          question: "What is the difference between hard and soft constraints?",
          answer:
            "Hard constraints are non-negotiable and must be met in any valid solution. Examples include legal requirements or necessary qualifications for specific shifts. Soft constraints are more flexible and serve for optimization. They can be neglected under certain circumstances, for instance, if it results in a better overall solution.",
        }, */
        {
          question:
            "How does the algorithm decide which shift is assigned to an employee?",
          answer: (
            <div className="pre-wrap">
              {`In a nutshell:

- Input Gathering: The algorithm aggregates crucial data such as employee availability, qualifications, preferences, and shift requirements.

- Constraints: So-called "Hard Constraints" like minimum and maximum working hours, or specific qualifications can be taken into account.

- Optimization: An objective function — targeting employee satisfaction — is optimized by the algorithm.

- Heuristics: Heuristics simplify decision-making by using approximate shortcuts or "rules of thumb" to rapidly identify satisfactory solutions.

- Improvement: The algorithm refines the solution by iteratively adjusting shift assignments to better meet the objective.

By balancing all these elements, the algorithm aims to assign shifts in a way that satisfies the operational constraints while also considering the preferences and well-being of the employees.`}
            </div>
          ),
        },
        {
          question: "How are my personal preferences taken into account?",
          answer:
            "Your personal preferences are captured prior to the creation of the shift schedule. You can assign a numerical value from 0 to 100 to each type of shift, with 100 representing your highest preference. These numerical preferences guide the algorithm in aligning the schedule as closely as possible with your preferences. However, the algorithm may need to make compromises with other factors, such as operational requirements and the preferences of your colleagues, to create a balanced and efficient schedule.",
        },
        {
          question: "Why don’t I always get my preferred shift?",
          answer:
          (
            <div className="pre-wrap">
              {`The allocation of shifts is a complex problem that considers various constraints and your preferences. However, achieving an optimal solution often involves trade-offs. Operational requirements and the preferences of other employees can influence the final schedule, which may result in you not always getting your preferred shift.

For instance, let's say you prefer to work the morning shift, but due to a high demand for morning shifts from other employees or operational needs, you may occasionally be assigned an afternoon or evening shift instead.` } </div>
          ),},
        {
          question: "Can the algorithm always find a “good” solution?",
          answer:
            "The algorithm aims to find the best solution possible."
          },
        {
          question:
            "How will the algorithm handle conflicts where multiple employees prefer the same shift?",
          answer:
            "When multiple employees prefer the same shift, the algorithm strives to find a fair solution while maximizing overall employee preferences. For instance, if two employees both want the morning shift, the algorithm will consider their preferences and other factors, like operational needs. It may assign the morning shift to one employee on some days and to the other on different days, all while aiming to maximize everyone's satisfaction."
        },
        {
          question:
            "Can the algorithm consider my long-term wishes, for example, if I know I want more time off in a particular month?",
          answer:
          "The algorithm considers long-term preferences, like desiring more time off in a specific month, through user profiles and customizable constraints. For instance, an employee can express a preference for reduced shifts in December. While this feature is not yet implemented, it is planned for future versions of the algorithm, allowing for a balance between short-term operational needs and long-term employee desires."  
        },
        {
          question:
            "How do sick leaves or sudden absences affect the shift schedule?",
          answer:
            "In the event of sick leaves or unexpected absences, the algorithm adjusts the shift schedule by efficiently finding replacements while still maximizing employee preferences.",
        },
        {
          question: "How quickly can the algorithm respond to sudden changes?",
          answer:
            "The algorithm is generally very quick, both in its general operation and in responding to changes like unexpected absences. These changes need to be input by the organization so that the AI algorithm can incorporate them into the scheduling process.",
        },
  
      ],
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
    <div className="faq-container">
      <h1 className="mt-5">Frequently Asked Questions (FAQ)</h1>
      {faqData.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <div className="h2-category">{category.category}</div>
          {category.items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className={`accordion mb-3 ${
                activeItems[categoryIndex * 100 + itemIndex] ? "show" : ""
              }`}
            >
              <div className="accordion-item">
                <h2
                  className="accordion-header"
                  id={`faq-heading-${itemIndex}`}
                >
                  <button
                    className={`accordion-button ${
                      activeItems[categoryIndex * 100 + itemIndex]
                        ? ""
                        : "collapsed"
                    }`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#faq-collapse-${itemIndex}`}
                    onClick={() =>
                      handleItemClick(categoryIndex * 100 + itemIndex)
                    }
                  >
                    {item.question}
                  </button>
                </h2>
                <div
                  id={`faq-collapse-${itemIndex}`}
                  className={`accordion-collapse collapse ${
                    activeItems[categoryIndex * 100 + itemIndex] ? "show" : ""
                  }`}
                  aria-labelledby={`faq-heading-${itemIndex}`}
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">{item.answer}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
