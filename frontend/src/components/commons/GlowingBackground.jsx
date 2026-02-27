// import React from "react";

// export default function GlowingBackground({ children }) {
//   return (
//     <div className="relative h-screen w-screen overflow-hidden bg-black text-white flex items-center justify-center">

//       {/* Glow */}
//       <div className="absolute -top-40 -left-40 w-100 h-100 bg-blue-500/30 rounded-full blur-[140px]" />

// {/* dotted grid */}
// <div
//   className="absolute inset-0 opacity-20 pointer-events-none"
//   style={{
//     backgroundImage:
//       "radial-gradient(circle, rgba(0,25,255,0.6) 1px, transparent 1px)",
//     backgroundSize: "24px 24px",
//     maskImage:
//       "radial-gradient(circle at 75% 50%, black 40%, transparent 70%)",
//   }}
// />

//       {/* Diagonal lines */}
// <div
//   className="absolute inset-0 z-1 pointer-events-none opacity-15"
//   style={{
//     backgroundImage: `
//       linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
//       linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
//     `,
//     backgroundSize: "120px 120px",
//   }}
// />

//       {/* Secondary Glow */}
//       <div className="absolute bottom-0 right-0 w-87.5 h-87.5 bg-blue-600/20 rounded-full blur-[120px]" />

//       {/* Pattern Overlay */}
//       <div
//         className="absolute inset-0 opacity-20 pointer-events-none"
//         style={{
//           backgroundImage:
//             "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
//           backgroundSize: "40px 40px",
//         }}
//       />

//       {/* Content */}
//       <div className="relative z-10 px-4 md:px-8 w-full max-w-md">
//         {children}
//       </div>
//     </div>
//   );
// }

import React, { useRef, useState } from "react";

export default function GlowingBackground({ children }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: "50%", y: "50%" });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    setPos({ x: `${x}px`, y: `${y}px` });

    const cx = r.width / 2;
    const cy = r.height / 2;

    setTilt({
      x: ((cy - y) / cy) * 6,
      y: ((x - cx) / cx) * 6,
    });
  };

  const onLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative h-screen w-screen overflow-hidden bg-black text-white flex items-center justify-center"
    >
      <div
        className="absolute inset-0 z-1 pointer-events-none opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px",
        }}
      />
      {/* 🌑 Base */}
      <div className="absolute inset-0 bg-black" />

      {/* 🔵 Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(450px at ${pos.x} ${pos.y},
            rgba(0,120,255,0.18),
            transparent 70%)`,
        }}
      />

      {/* 🔹 Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,80,255,.5) 1.5px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(circle at center, black 40%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 40%, transparent 75%)",
        }}
      />

      {/* 📦 Content (ONLY thing that tilts) */}
      <div
        className="relative z-10 w-full max-w-md px-4"
        style={{
          transform: `perspective(1000px)
            rotateX(${tilt.x}deg)
            rotateY(${tilt.y}deg)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}
