import React from 'react'
import { Button } from '../ui/button'
import Navbar from '../commons/Navbar'
import api from '@/api/api'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { startAssessment } from "@/redux/features/assessmentSlice";

export default function Dashboard() {
  
const navigate = useNavigate();
const dispatch = useDispatch();

const handleStart = async () => {
  try {
    const res = await api.post("/assessment/start");

    const { sessionId, question, totalQuestions } = res.data.data;

    dispatch(startAssessment({ sessionId, question, totalQuestions }));

    navigate("/interview");

  } catch (err) {
    console.error(err);
  }
};

  return (
    <>
    <Navbar />
    <div className='h-screen w-screen flex justify-center items-center'>
      <Button onClick={handleStart}
      className='p-4 h-10'>Start Assessment</Button>
    </div>
    </>
  )
}
