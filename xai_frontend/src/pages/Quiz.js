import React from "react";
import Quiz from "react-quiz-component";

export const quiz = {
  quizTitle: "AI-Based Shift Planning Quiz",
  quizSynopsis: "Test your knowledge of AI-based shift planning.",
  nrOfQuestions: "10",
  questions: [
    {
      question: "What is the primary purpose of AI-based shift planning?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "Cost savings",
        "Efficiency improvement",
        "Employee satisfaction",
        "All of the above",
      ],
      correctAnswer: "4",
      messageForCorrectAnswer:
        "Correct! AI-based shift planning aims to achieve cost savings, efficiency improvement, and employee satisfaction.",
      messageForIncorrectAnswer:
        "Sorry, that's incorrect. AI-based shift planning aims to achieve cost savings, efficiency improvement, and employee satisfaction.",
      explanation:
        "AI-based shift planning is designed to achieve cost savings, improve efficiency, and enhance employee satisfaction.",
      point: "10",
    },
    {
      question:
        "How does the shift planning system take employee preferences into account?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "Completely ignores them",
        "Considers them to some extent, depending on other factors",
        "Prioritizes them above all else",
        "Considers them only when there are no conflicts",
      ],
      correctAnswer: "2",
      messageForCorrectAnswer:
        "Correct! The shift planning system considers employee preferences to some extent, depending on other factors.",
      messageForIncorrectAnswer:
        "Sorry, that's incorrect. The shift planning system considers employee preferences to some extent, depending on other factors.",
      explanation:
        "The shift planning system takes employee preferences into account to some extent, but it also considers other factors like operational requirements and conflicts.",
      point: "10",
    },
    {
      question: "Why is optimizing shifts important for the company?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "Reduction of overtime",
        "Improvement of work morale",
        "Increase in overall efficiency",
        "All of the above",
      ],
      correctAnswer: "4",
      messageForCorrectAnswer:
        "Correct! Optimizing shifts is important for reducing overtime, improving work morale, and increasing overall efficiency.",
      messageForIncorrectAnswer:
        "Sorry, that's incorrect. Optimizing shifts is important for reducing overtime, improving work morale, and increasing overall efficiency.",
      explanation:
        "Optimizing shifts helps reduce overtime, boost work morale, and enhance the overall efficiency of the company.",
      point: "10",
    },
    {
      question:
        "What role does compliance with legal regulations play in shift planning?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "None",
        "An important role, but not the highest priority",
        "The highest priority",
        "One of many factors to consider",
      ],
      correctAnswer: "3",
      messageForCorrectAnswer:
        "Correct! Compliance with legal regulations is of the highest priority in shift planning.",
      messageForIncorrectAnswer:
        "Sorry, that's incorrect. Compliance with legal regulations is of the highest priority in shift planning.",
      explanation:
        "Compliance with legal regulations is a top priority in shift planning, ensuring that the company adheres to all relevant laws.",
      point: "10",
    },
    {
      question: "How can shift schedules be adjusted?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "Manually by the manager",
        "Automatically by the system",
        "Based on employee feedback",
        "All of the above",
      ],
      correctAnswer: "4",
      messageForCorrectAnswer:
        "Correct! Shift schedules can be adjusted manually by the manager, automatically by the system, or based on employee feedback.",
      messageForIncorrectAnswer:
        "Sorry, that's incorrect. Shift schedules can be adjusted manually by the manager, automatically by the system, or based on employee feedback.",
      explanation:
        "Shift schedules can be adjusted in various ways, including manual adjustments by the manager, automated changes by the system, and consideration of employee feedback.",
      point: "10",
    },
    {
      question: "What types of data does the system use for shift planning?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "Only employee preferences",
        "Only operational requirements",
        "A combination of various data sources",
        "Only historical shift data",
      ],
      correctAnswer: "3",
      messageForCorrectAnswer:
        "Correct! The shift planning system uses a combination of various data sources for shift planning.",
      messageForIncorrectAnswer:
        "Sorry, that's incorrect. The shift planning system uses a combination of various data sources for shift planning.",
      explanation:
        "The shift planning system leverages a combination of data sources to create effective shift schedules.",
      point: "10",
    },
    {
      question:
        "What advantage does What-If analysis offer in the shift planning system?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "It allows predictions of future shifts",
        "It assists with troubleshooting",
        "It enables better strategic planning",
        "It increases system transparency for users",
      ],
      correctAnswer: "4",
      messageForCorrectAnswer:
        "Correct! What-If analysis in the shift planning system increases system transparency for users.",
      messageForIncorrectAnswer:
        "Sorry, that's incorrect. What-If analysis in the shift planning system increases system transparency for users.",
      explanation:
        "What-If analysis helps users understand the system better and enhances its transparency.",
      point: "10",
    },
    {
      question:
        "Which elements contribute to the trustworthiness of the AI-based shift scheduling system?",
      questionType: "text",
      answerSelectionType: "multiple",
      answers: [
        "Transparency of Algorithm",
        "Ability to Handle Large Data Sets Efficiently",
        "Inclusion of Employee Preferences",
        "High Computational Speed",
      ],
      correctAnswer: [1,3],
      messageForCorrectAnswer:
        "Correct! What-If analysis in the shift planning system increases system transparency for users.",
      messageForIncorrectAnswer:
        "Sorry, that's incorrect. What-If analysis in the shift planning system increases system transparency for users.",
      explanation:
        "What-If analysis helps users understand the system better and enhances its transparency.",
      point: "10",
    },
    {
      question:
        "What are the types of constraints typically used in Constraint Optimization Problems (COPs)?",
      questionType: "text",
      answerSelectionType: "multiple",
      answers: [
        "Soft Constraints",
        "Equational Constraints",
        "Hard Constraints",
        "Non-equational Constraints",
      ],
      correctAnswer: [1, 3],
      messageForCorrectAnswer:
        "Correct! What-If analysis in the shift planning system increases system transparency for users.",
      messageForIncorrectAnswer:
        "Sorry, that's incorrect. What-If analysis in the shift planning system increases system transparency for users.",
      explanation:
        "What-If analysis helps users understand the system better and enhances its transparency.",
      point: "10",
    },
    {
      question:
        "Which of the following are key objectives of Explainable AI (XAI) in the context of shift scheduling?",
      questionType: "text",
      answerSelectionType: "multiple",
      answers: [
        "Improve Algorithm Efficiency",
        "Increase Human Trust in the System",
        "Enhance Transparency and Interpretability",
        "Facilitate Easier Data Collection",
      ],
      correctAnswer: [1,2,3],
      messageForCorrectAnswer:
        "Correct! What-If analysis in the shift planning system increases system transparency for users.",
      messageForIncorrectAnswer:
        "Sorry, that's incorrect. What-If analysis in the shift planning system increases system transparency for users.",
      explanation:
        "What-If analysis helps users understand the system better and enhances its transparency.",
      point: "10",
    },
  ],
};

export default function MCQuiz() {
  return (
    <div className="container">
    <div className="row justify-content-center">
      <div className="col-md-6 text-center">
        <h1>Understanding AI-based shift scheduling!</h1>
        <Quiz
          quiz={quiz}
          shuffle={true}
          showDefaultResult={true}
          showInstantFeedback={true}
        />
      </div>
    </div>
  </div>
  );
}
