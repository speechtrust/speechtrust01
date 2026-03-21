import { useState } from "react";
import { Mic } from "lucide-react";

export default function MicWave() {
  const [active, setActive] = useState(false);

  const bars = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]; // symmetric shape

  return (
    <div
      onClick={() => setActive(!active)}
      className="w-xs h-24 mx-auto flex items-center justify-center gap-4 rounded-xl px-6 cursor-pointer bg-gradient-to-r from-blue-900 to-blue-700"
    >
      {/* LEFT WAVE */}
      <Wave bars={bars} active={active} />

      {/* MIC BUTTON */}
      <div
        className={`w-16 h-16 flex items-center justify-center rounded-full border border-white/30 backdrop-blur-md transition ${
          active ? "bg-white/20 scale-105" : "bg-white/10"
        }`}
      >
        <Mic className="text-white" size={28} />
      </div>

      {/* RIGHT WAVE */}
      <Wave bars={bars} active={active} />
    </div>
  );
}

function Wave({ bars, active }) {
  return (
    <div className="flex items-center gap-1">
      {bars.map((h, i) => (
        <span
          key={i}
          className={`w-1 rounded-full bg-white transition-all duration-300 ${
            active ? "animate-wave" : "h-1.5 opacity-60"
          }`}
          style={{
            height: active ? `${h * 6 + 6}px` : "6px",
            animationDelay: `-${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}