// import { useLocation } from "react-router-dom";

// const Interview = () => {

//   const location = useLocation();
//   const { sessionId, question, totalQuestions } = location.state;
//   const [phase, setPhase] = useState("reading");
// const [readTimer, setReadTimer] = useState(question.readTime);
// const [answerTimer, setAnswerTimer] = useState(question.answerTime);

// useEffect(() => {

//   if (phase !== "reading") return;

//   const timer = setInterval(() => {

//     setReadTimer((prev) => {

//       if (prev <= 1) {
//         clearInterval(timer);
//         setPhase("recording");
//         return 0;
//       }

//       return prev - 1;

//     });

//   }, 1000);

//   return () => clearInterval(timer);

// }, [phase]);

// useEffect(() => {

//   if (phase !== "recording") return;

//   const timer = setInterval(() => {

//     setAnswerTimer((prev) => {

//       if (prev <= 1) {
//         clearInterval(timer);
//         handleNext(); // auto submit
//         return 0;
//       }

//       return prev - 1;

//     });

//   }, 1000);

//   return () => clearInterval(timer);

// }, [phase]);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">

//       <h2>
//         Question {question.order} / {totalQuestions}
//       </h2>

//       <p className="text-xl mt-4">
//         {question.text}
//       </p>

//       <button className="mt-10">
//         Next
//       </button>

//     </div>
//   );
// };

// export default Interview;

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

    // <div className="h-screen w-screen flex items-center justify-center bg-gray-100">

    //   <div className="bg-white p-8 rounded-lg shadow-lg w-3/4">

    //     {/* Progress */}
    //     <h2 className="text-sm text-gray-500 mb-2">
    //       Question {question.order} / {totalQuestions}
    //     </h2>

    //     {/* Question */}
    //     <h1 className="text-xl font-semibold mb-6">
    //       {question.text}
    //     </h1>



    //     {/* Phase UI */}

    //     {phase === "reading" && (
    //       <div className="text-center mb-6">
    //         <p className="text-blue-600 font-medium">
    //           Reading Time
    //         </p>
    //         <p className="text-3xl font-bold">
    //           {readTimer}s
    //         </p>
    //       </div>
    //     )}



    //     {phase === "recording" && (
    //       <div className="text-center mb-6">

    //         <p className="text-red-600 font-medium">
    //           🎤 Recording...
    //         </p>

    //         <p className="text-3xl font-bold">
    //           {answerTimer}s
    //         </p>

    //       </div>
    //     )}



    //     {phase === "uploading" && (
    //       <div className="text-center mb-6">

    //         <p className="text-green-600 font-medium">
    //           Uploading answer...
    //         </p>

    //       </div>
    //     )}



    //     {/* Next Button */}

    //     <div className="flex justify-center">

    //       <button
    //         onClick={handleNext}
    //         disabled={phase === "reading"}
    //         className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
    //       >
    //         Next
    //       </button>

    //     </div>

    //   </div>

    // </div>

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
          <h3 className="text-lg">fgvhbbbj</h3>
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
