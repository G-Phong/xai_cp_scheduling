declare module 'react-quiz-component' {
    export interface QuizQuestion {
      question: string;
      options: string[];
      correctAnswer: string;
    }
  
    export interface QuizProps {
      questions: QuizQuestion[];
    }
  
    const Quiz: React.FC<QuizProps>;
    export default Quiz;
  }
  