import React, { useRef, useState } from "react";
import { Toaster } from "sonner";
import Navbar from "../commons/Navbar";

export default function AuthLayout({ children }) {
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
      x: ((cy - y) / cy) * 3, // Reduced intensity slightly for a more premium feel
      y: ((x - cx) / cx) * 3,
    });
  };

  const onLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <>
      <Toaster position="top-left" richColors />
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative min-h-screen w-screen overflow-hidden bg-slate-50 flex items-center justify-center pt-16"
      >
        {/* Diagonal Lines Background */}
        <div
          className="absolute inset-0 z-1 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* 🔵 Mouse Tracking Glow (Light Theme) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px at ${pos.x} ${pos.y}, rgba(37, 99, 235, 0.08), transparent 80%)`,
          }}
        />

        {/* 🔹 Subtle Dot Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(22, 36, 86, 0.4) 1.5px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(circle at center, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 80%)",
          }}
        />

        {/* 📦 Content Container (Tilts on hover) */}
        <div
          className="relative z-10 w-full max-w-md px-6 py-12"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}