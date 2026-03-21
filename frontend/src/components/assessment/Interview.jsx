import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import MicBar from "./MicBar";
import { Button } from "../ui/button";

const Interview = () => {

  const location = useLocation();
  const { sessionId, question: initialQuestion, totalQuestions } = location.state;

  const [question, setQuestion] = useState(initialQuestion);

  const [phase, setPhase] = useState("reading");

  const [readTimer, setReadTimer] = useState(initialQuestion.readTime);
  const [answerTimer, setAnswerTimer] = useState(initialQuestion.answerTime);

  // Reset timers when question changes
  useEffect(() => {

    if (!question) return;

    setPhase("reading");
    setReadTimer(question.readTime);
    setAnswerTimer(question.answerTime);

  }, [question]);



  // Reading Timer
  useEffect(() => {

    if (phase !== "reading") return;

    const timer = setInterval(() => {

      setReadTimer((prev) => {

        if (prev <= 1) {
          clearInterval(timer);
          setPhase("recording");
          return 0;
        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, [phase]);



  // Answer Timer
  useEffect(() => {

    if (phase !== "recording") return;

    const timer = setInterval(() => {

      setAnswerTimer((prev) => {

        if (prev <= 1) {
          clearInterval(timer);
          handleNext();
          return 0;
        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, [phase]);



  const handleNext = () => {

    if (phase === "uploading") return;

    setPhase("uploading");

    console.log("Submitting answer...");
  };



  return (
<>
  <div className="h-screen w-screen overflow-hidden flex flex-col">
    
    <TopBar />

    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col">
        <div className="bg-black/10 h-16 flex items-center justify-between p-4">
          <h3 className="text-2xl font-semibold">Question no. 1</h3>
            <Button>Submit</Button>
        </div>
        <div className="flex flex-1 flex-col p-4 justify-between overflow-hidden">
          <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Tell me about your self ?</h3>
          Marks: +1
          </div>
          <div className="w-full flex justify-center">
            <MicBar />
          </div>
        </div>
      </div>
      <Sidebar />
    </div>
  </div>
</>

  );
};

export default Interview;
