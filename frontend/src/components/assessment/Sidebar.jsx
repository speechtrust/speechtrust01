import React from 'react';
import Timer from './Timer';
import QuestionNavigator from './QuestionsBar';

// Added props to receive data from Interview.jsx
export default function Sidebar({ totalQuestions, currentIndex, answeredQuestions, setQuestionIndex }) {
  return (
    <div className="h-full w-[300px] bg-white flex flex-col border-l border-gray-200">
      
      {/* Top Half: Question Navigator */}
      <div className='h-1/2 overflow-hidden border-b border-gray-200'>
        <QuestionNavigator 
          totalQuestions={totalQuestions} 
          currentIndex={currentIndex} 
          answeredQuestions={answeredQuestions}
          onQuestionClick={(index) => setQuestionIndex(index)}
        />
      </div>

      {/* Bottom Half: Timer */}
      <div className='bg-pink-700 h-1/2 flex flex-col gap-4 justify-center items-center pb-8'>
        <span className="text-white font-medium text-center px-4">
          Read Time Remain / Answer Time Remain
        </span>
        <Timer />
      </div>
      
    </div>
  );
}