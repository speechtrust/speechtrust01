import React from 'react';

export default function QuestionsBar({
  totalQuestions = 20,
  currentIndex = 0,
  answeredQuestions = [], // Array of indices that have been answered e.g., [0, 1, 2]
  onQuestionClick
}) {
  // Find the first question that hasn't been answered yet
  // If all are answered, it returns -1.
  const firstUnansweredIndex = Array.from({ length: totalQuestions }).findIndex(
    (_, i) => !answeredQuestions.includes(i)
  );
  
  // Determine how far the user is allowed to click
  const maxAllowedIndex = firstUnansweredIndex === -1 ? totalQuestions - 1 : firstUnansweredIndex;

  const attemptedCount = answeredQuestions.length;
  const unattemptedCount = totalQuestions - attemptedCount;

  return (
    <div className="flex flex-col h-full w-full bg-white text-black p-4 overflow-y-auto">
      
      {/* --- Status Legend --- */}
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
          const isLocked = index > maxAllowedIndex; // Locked if beyond the first unanswered question

          // Base styles for the button
          let btnClass = "flex items-center justify-center h-10 w-full rounded font-semibold text-sm transition-all duration-200 ";

          // Apply specific styles based on state
          if (isCurrent) {
            btnClass += "bg-blue-600 text-white ring-2 ring-offset-2 ring-blue-400"; // Active state
          } else if (isAttempted) {
            btnClass += "bg-green-500 text-white hover:bg-green-600 cursor-pointer shadow-sm"; // Answered state
          } else if (isLocked) {
            btnClass += "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"; // Locked future state
          } else {
            btnClass += "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm"; // Unlocked, unattempted state
          }

          return (
            <button
              key={index}
              onClick={() => !isLocked && onQuestionClick(index)}
              disabled={isLocked}
              className={btnClass}
              title={isLocked ? "Complete previous questions to unlock" : `Go to question ${index + 1}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      
    </div>
  );
}