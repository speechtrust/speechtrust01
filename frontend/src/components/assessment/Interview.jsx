import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import MicBar from "./MicBar";
import { Button } from "../ui/button";
import { Send } from "lucide-react";

const Interview = () => {
  const location = useLocation();
  // Provide fallbacks in case location.state is null during testing
  const state = location.state || {};
  const initialQuestion = state.question || {
    text: "Tell me about yourself?",
    readTime: 10,
    answerTime: 60,
    weight: 1,
    order: 1,
  };
  const totalQuestions = state.totalQuestions || 5;

  const [question, setQuestion] = useState(initialQuestion);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const [phase, setPhase] = useState("reading"); // "reading" | "recording" | "uploading"
  const [micActive, setMicActive] = useState(false);

  // Derive timer values based on phase
  const currentDuration =
    phase === "reading" ? question.readTime : question.answerTime;
  // Create a unique key for the timer so it resets perfectly when phase or question changes
  const timerKey = `timer-${currentIndex}-${phase}`;

  // Reading Timer Logic
  useEffect(() => {
    if (phase !== "reading") return;
    const timer = setTimeout(() => {
      setPhase("recording");
      setMicActive(true); // Auto-start mic when answer time begins
    }, question.readTime * 1000);
    return () => clearTimeout(timer);
  }, [phase, question.readTime]);

  // Answer Timer Logic
  useEffect(() => {
    if (phase !== "recording") return;
    const timer = setTimeout(() => {
      handleNext();
    }, question.answerTime * 1000);
    return () => clearTimeout(timer);
  }, [phase, question.answerTime]);

  const handleNext = () => {
    if (phase === "uploading") return;
    setPhase("uploading");
    setMicActive(false);
    console.log("Submitting answer to Python backend...");

    // Simulate API call delay (replace this with your actual Axios call to your controller)
    setTimeout(() => {
      setAnsweredQuestions((prev) => [...prev, currentIndex]);

      // Move to next dummy question (replace with API response nextQuestion)
      setCurrentIndex((prev) => prev + 1);
      setQuestion({
        ...question,
        text: `This is question number ${currentIndex + 2}`,
        order: currentIndex + 2,
      });
      setPhase("reading");
    }, 2000);
  };

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col font-sans overflow-hidden">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-8">
          {/* Question Header Card */}
          <div className="bg-white rounded-t-2xl shadow-sm border border-slate-200 border-b-0 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">
              Question {currentIndex + 1}{" "}
              <span className="text-slate-400 font-medium text-lg">
                / {totalQuestions}
              </span>
            </h2>
            <Button
              onClick={handleNext}
              disabled={phase === "uploading" || phase === "reading"}
              className={`flex items-center gap-2 ${phase === "uploading" ? "bg-slate-400!" : "bg-blue-600! hover:bg-blue-700!"}`}
            >
              {phase === "uploading" ? "Saving..." : "Submit Answer"}
            </Button>
          </div>

          {/* Question Body Card */}
          <div className="bg-white flex-1 rounded-b-2xl shadow-sm border border-slate-200 flex flex-col justify-between overflow-hidden relative">
            <div className="p-8 md:p-6 overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-sm font-semibold border border-indigo-100">
                  Weight: {question.weight}x
                </span>
              </div>
              <h3 className="text-3xl font-medium text-slate-800 leading-relaxed">
                {question.text}
              </h3>
            </div>

            {/* Mic Section */}
            <div className="w-full bg-slate-50 border-t border-slate-200 p-8 flex justify-center">
              <MicBar active={micActive} phase={phase} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar
          totalQuestions={totalQuestions}
          currentIndex={currentIndex}
          answeredQuestions={answeredQuestions}
          phase={phase}
          currentDuration={currentDuration}
          timerKey={timerKey}
        />
      </div>
    </div>
  );
};

export default Interview;
