import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default function Timer({ duration, isPlaying, onComplete, timerKey }) {
  return (
    <CountdownCircleTimer
      key={timerKey}
      isPlaying={isPlaying}
      duration={duration}
      colors={["#22C55E", "#84CC16", "#FACC15", "#F97316", "#EF4444"]}
      colorsTime={[
        duration,
        duration * 0.75,
        duration * 0.5,
        duration * 0.25,
        0,
      ]}
      size={180}
      strokeWidth={12}
      trailStrokeWidth={12}
      trailColor="#F1F5F9"
      onComplete={onComplete}
    >
      {({ remainingTime }) => (
        <div className="flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-slate-800">
            {remainingTime}
          </span>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-medium mt-1">
            Seconds
          </span>
        </div>
      )}
    </CountdownCircleTimer>
  );
}
