import React from 'react';

export default function QuestionsBar({
  totalQuestions = 20,
  currentIndex = 0,
  answeredQuestions = [], 
}) {
  const attemptedCount = answeredQuestions.length;
  const unattemptedCount = totalQuestions - attemptedCount;

  return (
    <div className="flex flex-col h-full w-full bg-white text-black p-4 overflow-y-auto">
      
      <div className="grid grid-cols-2 gap-2 mb-6 text-xs font-medium">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span>Attempted: {attemptedCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-gray-400 bg-white"></div>
          <span>Unattempted: {unattemptedCount}</span>
        </div>
      </div>

      {/* --- Question Grid --- */}
      <h4 className="text-sm font-semibold mb-3 text-gray-600 uppercase tracking-wider">
        Questions
      </h4>
      
      <div className="grid grid-cols-4 gap-2 lg:gap-3">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isAttempted = answeredQuestions.includes(index);
          const isCurrent = index === currentIndex;

          let itemClass = "flex items-center justify-center h-10 w-full rounded font-semibold text-sm transition-all duration-200 cursor-default ";

          if (isCurrent) {
            itemClass += "bg-blue-600 text-white ring-2 ring-offset-2 ring-blue-400 cursor-pointer"; 
          } else if (isAttempted) {
            itemClass += "bg-green-500 text-white shadow-sm cursor-not-allowed"; 
          } else {
            itemClass += "bg-gray-100 text-gray-400 opacity-70 cursor-not-allowed"; 
          }

          return (
            <div
              key={index}
              className={itemClass}
              title={isCurrent ? "Current Question" : isAttempted ? "Attempted" : "Unattempted"}
            >
              {index + 1}
            </div>
          );
        })}
      </div> 
    </div>
  );
}