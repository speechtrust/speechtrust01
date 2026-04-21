import React from 'react';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import { resetAssessment } from "@/redux/features/assessmentSlice";

export default function TopBar() {
  const dispatch = useDispatch();
const navigate = useNavigate();

const { sessionId } = useSelector((state) => state.assessment);

const handleFinish = async () => {
  try {
    const res = await api.post("/assessment/finish", {
      sessionId,
    });

    dispatch(resetAssessment());

    navigate(`/result/${sessionId}`, {
      state: res.data,
    });

  } catch (err) {
    console.error("Finish failed", err);
  }
};
  return (
    <div className="w-full bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center gap-3">
        <span className="text-slate-800 font-semibold text-lg tracking-tight">
          Assessment
        </span>
      </div>
      <Button
  onClick={handleFinish}
  variant="outline"
  className="border-slate-300! text-slate-700! hover:bg-slate-200! bg-transparent!"
>
  Finish Assessment
</Button>
    </div>
  );
}