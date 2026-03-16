import React from 'react'
import { useNavigate } from 'react-router-dom';

const Background = () => {
  const navigate = useNavigate();
 return (
    <div className="relative h-screen  w-screen overflow-hidden bg-black text-white flex items-center">

      {/* Glow */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px]
                      bg-orange-500/30 rounded-full blur-[140px]" />
       
       {/* dotted grid in bg */}
       <div
          className="absolute inset-0 opacity-20 pointer-events-none"
           style={{
             backgroundImage:
            "radial-gradient(circle, rgba(255,165,0,0.6) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
             maskImage:
             "radial-gradient(circle at 75% 50%, black 40%, transparent 70%)",
            }}
     />

     {/* Diagonal lines */}
  
<div
  className="absolute inset-0 z-[1] pointer-events-none opacity-15"
  style={{
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
    `,
    backgroundSize: "120px 120px",
  }}
/>

      {/* Secondary Glow */}
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px]
                      bg-orange-600/20 rounded-full blur-[120px]" />

      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-10 md:px-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Confidence Evaluation System
        </h1>

        <p className="text-gray-400 max-w-xl mb-8">
          Analyze confidence through voice and behavioral patterns using AI.
        </p>

        <button onClick={() => navigate("/dashboard")} 
        className="px-8 py-3 rounded-full bg-orange-600
                           hover:!bg-blue-600 transition shadow-lg">
          Start Evaluation →
        </button>
      </div>
    </div>
  );
}

export default Background;
