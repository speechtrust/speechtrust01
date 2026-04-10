import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import MicBar from "./MicBar";
import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import { setNextQuestion, setPhase } from "@/redux/features/assessmentSlice";
import api from "@/api/api";
import { resetAssessment } from "@/redux/features/assessmentSlice";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const Interview = () => {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { sessionId, currentQuestion, totalQuestions, questionIndex, phase } =
    useSelector((state) => state.assessment);

  const question = currentQuestion;
  const currentIndex = questionIndex - 1;

  // Local UI states
  const [micActive, setMicActive] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  // Safety check
  if (!question) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Session lost. Please restart assessment.</p>
      </div>
    );
  }

  // Timer values
  const currentDuration =
    phase === "reading" ? question.readTime : question.answerTime;

  const timerKey = `timer-${currentIndex}-${phase}`;

  // Reading Timer
  useEffect(() => {
    if (phase !== "reading") return;

    const timer = setTimeout(() => {
      dispatch(setPhase("recording"));
      setMicActive(true);
      startRecording();
    }, question.readTime * 1000);

    return () => clearTimeout(timer);
  }, [phase, question.readTime, dispatch]);

  // Answer Timer
  useEffect(() => {
    if (phase !== "recording") return;

    const timer = setTimeout(() => {
      handleNext();
    }, question.answerTime * 1000);

    return () => clearTimeout(timer);
  }, [phase, question.answerTime]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Submit Answer
  const handleNext = async () => {
    if (phase === "uploading") return;

    dispatch(setPhase("uploading"));
    setMicActive(false);

    try {
      const audioBlob = await stopRecording();

      const formData = new FormData();

      formData.append("sessionId", sessionId);
      formData.append("submittedEarly", true);

      // ✅ ADD AUDIO
      if (audioBlob) {
        formData.append("audio", audioBlob, "answer.webm");
      }

      const res = await api.post("/assessment/answer", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.completed) {
        console.log("Assessment completed", res.data);

        dispatch(resetAssessment()); // ✅ CLEAR STATE

        // Fix: Route requires the session ID parameter
        navigate(`/result/${sessionId}`, {
          state: res.data, // send result to result page
        });

        return;
      }

      const nextQuestion = res.data.nextQuestion;

      dispatch(setNextQuestion(nextQuestion));

      setAnsweredQuestions((prev) => [...prev, currentIndex]);
    } catch (err) {
      console.error("Submit failed", err);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();

      console.log("Recording started");
    } catch (err) {
      console.error("Mic permission denied", err);
    }
  };

  const stopRecording = () => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;

      if (!mediaRecorder) return resolve(null);

      mediaRecorder.stop();

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        resolve(audioBlob);
      };
    });
  };

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col font-sans overflow-hidden">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col p-8">
          {/* Header */}
          <div className="bg-white rounded-t-2xl shadow-sm border border-slate-200 border-b-0 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">
              Question {currentIndex + 1}{" "}
              <span className="text-slate-400 text-lg">/ {totalQuestions}</span>
            </h2>

            <Button
              onClick={handleNext}
              disabled={phase === "uploading" || phase === "reading"}
              className={`${
                phase === "uploading"
                  ? "bg-slate-400!"
                  : "bg-blue-600! hover:bg-blue-700!"
              }`}
            >
              {phase === "uploading" ? "Saving..." : "Submit Answer"}
            </Button>
          </div>

          {/* Question */}
          <div className="bg-white flex-1 rounded-b-2xl shadow-sm border border-slate-200 flex flex-col justify-between overflow-hidden">
            <div className="p-8">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-sm border">
                Weight: {question.weight}x
              </span>

              <h3 className="text-3xl mt-6 text-slate-800">{question.text}</h3>
            </div>

            {/* Mic Section */}
            <div className="bg-slate-50 border-t p-6 flex justify-center">
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
