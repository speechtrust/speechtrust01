import React from 'react'
import { Button } from '../ui/button'
import Navbar from '../commons/Navbar'
import api from '@/api/api'
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
const navigate = useNavigate();

const handleStart = async () => {
  try {
    const res = await api.post("/assessment/start");

    const { sessionId, question, totalQuestions } = res.data.data;

    navigate("/interview", {
      state: {
        sessionId,
        question,
        totalQuestions
      }
    });

  } catch (err) {
    console.error("Failed to start assessment", err);
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
