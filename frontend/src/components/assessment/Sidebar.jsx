import React from 'react';
import Timer from './Timer';
import QuestionNavigator from './QuestionsBar';

export default function Sidebar({ 
  totalQuestions, 
  currentIndex, 
  answeredQuestions, 
  phase, 
  currentDuration, 
  timerKey 
}) {
  return (
    <div className="h-full w-[320px] bg-slate-50 border-l border-slate-200 flex flex-col z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
      
      {/* Top Half: Question Grid */}
      <div className='flex-1 overflow-hidden border-b border-slate-200 bg-white'>
        <QuestionNavigator 
          totalQuestions={totalQuestions} 
          currentIndex={currentIndex} 
          answeredQuestions={answeredQuestions}
          onQuestionClick={() => {}} // Disabled jumping for now to maintain strict flow
        />
      </div>

      {/* Bottom Half: Timer Status */}
      <div className='h-70 bg-slate-50 flex flex-col justify-center items-center p-6'>
        <div className="mb-4 text-center">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            phase === 'reading' ? 'bg-amber-100 text-amber-700' :
            phase === 'recording' ? 'bg-red-100 text-red-700 animate-pulse' :
            'bg-blue-100 text-blue-700'
          }`}>
            {phase === 'reading' ? 'Reading Time' : 
             phase === 'recording' ? 'Recording Answer' : 'Uploading...'}
          </span>
        </div>
        
        <Timer 
          timerKey={timerKey} 
          duration={currentDuration} 
          isPlaying={phase !== 'uploading'} 
        />
      </div>
      
    </div>
  );
}