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
        className="absolute inset-0 z-1 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px",
        }}
      />
      <div className="absolute inset-0 bg-slate-800" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(450px at ${pos.x} ${pos.y},
            rgba(0,120,255,0.18),
            transparent 70%)`,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-75"
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
