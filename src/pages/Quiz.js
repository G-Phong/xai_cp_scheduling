import React from "react";
import Quiz from "react-quiz-component";

import "./Quiz.css";

export const quiz = {
  quizTitle: "AI-based Shift Scheduling",
  quizSynopsis: "You get 10 marks for each correct answer.",
  nrOfQuestions: "10",
  questions: [
    {
      question: "Why should one use AI-methods for shift scheduling?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "Cost savings",
        "Efficiency improvement",
        "Employee satisfaction",
        "All of the above",
      ],
      correctAnswer: "4",
      messageForCorrectAnswer: "Correct!",
      messageForIncorrectAnswer:
        "Sorry, that's incorrect. All of them are correct.",
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
      messageForCorrectAnswer: "Correct!",
      messageForIncorrectAnswer:
        "Sorry, that's incorrect. Preferences are soft constraints!",
      explanation:
        "The shift planning system takes employee preferences (soft constraints) into account to some extent, but it also considers other factors like operational requirements and conflicts.",
      point: "10",
    },
    {
      question: "Why are good shift schedules important for a company?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "Reduction of overtime",
        "Improvement of work morale",
        "Increase in overall efficiency",
        "All of the above",
      ],
      correctAnswer: "4",
      messageForCorrectAnswer: "Correct!",
      messageForIncorrectAnswer: "Sorry, that's incorrect.",
      explanation:
        "Optimizing shifts helps to reduce overtime, to boost work morale, and to enhance the overall efficiency of the company.",
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
      messageForCorrectAnswer: "Correct!",
      messageForIncorrectAnswer:
        "Sorry, that's incorrect. Legal regulations must be respected!",
      explanation:
        "Compliance with legal regulations is a top priority in shift planning, ensuring that the company adheres to all relevant laws.",
      point: "10",
    },
    {
      question: "How can shift schedules be modified?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "Manually by the manager",
        "Automatically by the system",
        "Based on employee feedback",
        "All of the above",
      ],
      correctAnswer: "4",
      messageForCorrectAnswer: "Correct!",
      messageForIncorrectAnswer: "Sorry, that's incorrect.",
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
      messageForCorrectAnswer: "Correct!",
      messageForIncorrectAnswer: "Sorry, that's incorrect.",
      explanation:
        "The shift planning system leverages a combination of data sources to create effective shift schedules.",
      point: "10",
    },
    {
      question:
        "What advantage do the What-If-Scenarios offer in the shift planning system?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "It allows predictions of future shifts",
        "It assists with troubleshooting",
        "It enables better strategic planning",
        "It provides comparisons and thereby increases transparency",
      ],
      correctAnswer: "4",
      messageForCorrectAnswer: "Correct!",
      messageForIncorrectAnswer:
        "Sorry, that's incorrect. They are only for the purpose of explanation.",
      explanation:
        "What-If-Scenarios helps users understand the system better and enhances its transparency.",
      point: "10",
    },
    {
      question:
        "Which elements contribute to the trustworthiness of the AI-based shift scheduling system?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [        "Transparency of Algorithm",
      "Ability to Handle Large Data Sets Efficiently",
      "Inclusion of Employee Preferences",
      "High Computational Speed",
 
      ],
      correctAnswer: "1",
      messageForCorrectAnswer: "Correct!",
      messageForIncorrectAnswer: "Sorry, that's incorrect",
      explanation:
        "Transparent algorithms lead to better understanding of those, and thus they can lead to more trust into the system.",
      point: "10",
    },
    {
      question:
        "What are the types of constraints typically used in Shift Scheduling?",
      questionType: "text",
      answerSelectionType: "multiple",
      answers: [
        "Soft Constraints (Employee preferences)",
        "Equational Constraints (Mathematical rules)",
        "Hard Constraints (Legal regulations)",
        "Non-equational Constraints",
      ],
      correctAnswer: [1, 3],
      messageForCorrectAnswer: "Correct!",
      messageForIncorrectAnswer: "Sorry, that's incorrect.",
      explanation:
        "In a Constraint Optimization Problem you usually have hard and soft constraints. In the context of shift scheduling you have employee preferences and the legal regulations of the company.",
      point: "10",
    },
    {
      question:
        "What are the objectives of explaining Artificial Intelligence Systems?",
      questionType: "text",
      answerSelectionType: "multiple",
      answers: [
        "Improve Algorithm Efficiency",
        "Increase Human Trust in the System",
        "Make the AI more transparent and understandable",
        "Facilitate Easier Data Collection",
      ],
      correctAnswer: [1, 2, 3],
      messageForCorrectAnswer: "Correct!",
      messageForIncorrectAnswer: "Sorry, that's incorrect.",
      explanation:
        "Easier data collection is NOT achieved by Explainable Artificial Intelligence.",
      point: "10",
    },
  ],
};
export default function MCQuiz() {
  return (
    <div className="quiz-container d-flex justify-content-center align-items-center">
      <div className="text-center">
        <h1>Test your knowledge!</h1>
        <Quiz
          quiz={quiz}
          shuffle={true}
          showDefaultResult={true}
          showInstantFeedback={true}
        />
      </div>
    </div>
  );
}
