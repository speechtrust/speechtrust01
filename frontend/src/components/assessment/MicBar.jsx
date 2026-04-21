import { Mic, MicOff, Loader2 } from "lucide-react";

export default function MicBar({ active, phase }) {
  const bars = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];

  const isDisabled = phase === "reading" || phase === "uploading";

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`w-105 h-28 mx-auto flex items-center justify-center gap-6 rounded-2xl px-6 transition-all duration-300 ${
          isDisabled 
            ? "bg-slate-200 opacity-70" 
            : active 
              ? "bg-linear-to-r from-indigo-600 to-blue-500 shadow-lg shadow-indigo-500/30 scale-[1.02]" 
              : "bg-slate-800 shadow-md"
        }`}
      >
        {/* LEFT WAVE */}
        <Wave bars={bars} active={active} />

        {/* MIC ICON */}
        <div
          className={`w-16 h-16 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
            active 
              ? "bg-white border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.4)]" 
              : isDisabled
                ? "bg-slate-300 border-slate-400"
                : "bg-slate-700 border-slate-500"
          }`}
        >
          {phase === "uploading" ? (
            <Loader2 className="text-slate-500 animate-spin" size={28} />
          ) : active ? (
             <Mic className="text-indigo-600" size={28} />
          ) : (
            <MicOff className={isDisabled ? "text-slate-500" : "text-slate-300"} size={28} />
          )}
        </div>

        {/* RIGHT WAVE */}
        <Wave bars={bars} active={active} />
      </div>
      
      <p className="text-sm font-medium text-slate-500 h-5">
        {phase === "reading" && "Microphone will turn on automatically..."}
        {phase === "recording" && "Recording in progress... Speak now."}
        {phase === "uploading" && "Saving your answer..."}
      </p>
    </div>
  );
}

function Wave({ bars, active }) {
  return (
    <div className="flex items-center gap-1.5">
      {bars.map((h, i) => (
        <span
          key={i}
          className={`w-1.5 rounded-full transition-all duration-200 ${
            active ? "bg-white animate-wave" : "bg-white/30 h-2"
          }`}
          style={{
            height: active ? `${h * 6 + 8}px` : "8px",
            animationDelay: `-${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}