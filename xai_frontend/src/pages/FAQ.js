import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FAQ.css";

export default function FAQ() {
  // FAQ-Data with questions and answers
  const faqData = [
    {
      category: "AI-based shift scheduling system",
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
          question:
            "Is there a deadline for entering my preferences?",
          answer:
            "Yes, preferences should ideally be submitted by a set deadline, depending on the company regulations.",
        },
        {
          question:
            "How can I give feedback on the shift plan after it has been created?",
          answer:
            "Once the shift plan has been created, there is a feedback phase. You can submit your feedback directly via the system. A designated area is provided where you can make comments and reviews on the assigned shifts.",
        },
        {
          question:
            "How can employees incorporate their feedback and preferences into the process?",
          answer:
            "Before the creation of the shift plan, employees can state their preferences for specific jobs on a scale of 0 to 100. After the shift schedule has been created, there is also the opportunity to provide feedback on the received plan.",
        },
        {
          question:
            "How are legal and operational requirements taken into account?",
          answer:
            "The algorithm is designed to consider all legal requirements and operational guidelines, such as maximum working hours or mandatory breaks, as hard constraints. These are prioritized in the optimization.",
        },
      ],
    },
    {
      category: "Optimization and Algorithm",
      items: [
        {
          question:
            "How does the algorithm decide which shift is assigned to an employee?",
          answer:
            "The algorithm uses a heuristic that combines various factors such as availability, qualifications, and employee preferences as well as operational requirements. The objective function is optimized to achieve fair and efficient shift allocation.",
        },
        {
          question: "What is a Constraint Optimization Problem (COP)?",
          answer:
            "A Constraint Optimization Problem (COP) is a special case of a Constraint Satisfaction Problem (CSP). Unlike CSP, which only aims to satisfy all constraints, COP aims to find a solution that not only satisfies all constraints but also optimizes an objective function, such as minimizing overtime or maximizing employee satisfaction.",
        },
        {
          question: "What is the difference between hard and soft constraints?",
          answer:
            "Hard constraints are non-negotiable and must be met in any valid solution. Examples include legal requirements or necessary qualifications for specific shifts. Soft constraints are more flexible and serve for optimization. They can be neglected under certain circumstances, for instance, if it results in a better overall solution.",
        },
        {
          question: "Why don’t I always get my preferred shift?",
          answer:
            "The allocation of shifts is a complex optimization problem that takes into account multiple constraints and preferences. While your preferences are considered in the algorithm, other factors such as operational requirements or the preferences of other employees may mean that you do not always get your preferred shift.",
        },
        {
          question: "Can the algorithm always find a “good” solution?",
          answer:
            "The algorithm aims to find the most optimal solution possible. However, the quality of the solution can be influenced by various factors such as the complexity of the problem, the number of employees and shifts, and available resources. A “good” solution is therefore relative and depends on specific requirements and constraints.",
        },
        {
          question:
            "How will the algorithm handle conflicts where multiple employees prefer the same shift?",
          answer:
            "In such cases, the algorithm performs an optimization to resolve the conflict as fairly as possible. Soft constraints and other metrics are also considered.",
        },
        {
          question:
            "Can the algorithm consider my long-term wishes, for example, if I know I want more time off in a particular month?",
          answer:
            "This functionality is not currently implemented, but it is planned to consider such long-term wishes in future updates of the algorithm.",
        },
        {
          question:
            "How do sick leaves or sudden absences affect the shift schedule?",
          answer:
            "Sick leaves or sudden absences trigger a re-optimization of the shift plan to minimize the impact on the overall system.",
        },
        {
          question: "How quickly can the algorithm respond to sudden changes?",
          answer:
            "The algorithm is designed to respond quickly to changes. The exact response time depends on the complexity of the problem and the available computational resources.",
        },
        {
          question: "How are my personal preferences taken into account?",
          answer:
            "Your personal preferences are captured prior to the creation of the shift schedule and are introduced as soft constraints into the algorithm. These soft constraints influence the optimization decision, although compromises with other factors, such as operational requirements and the preferences of other employees, may be made. The explanation model aims to provide insights into how your preferences were considered in the schedule.",
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
      <h1 className="mt-5">FAQ</h1>
      {faqData.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <h2>{category.category}</h2>
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
