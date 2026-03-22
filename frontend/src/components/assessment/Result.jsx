import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, RotateCcw, Clock, Trophy, Target, Mic, Activity } from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from "recharts";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Fallback data for testing the UI if accessed directly without routing state
  const { finalScore = 82, duration = 145 } = location.state || {};

  if (!location.state && process.env.NODE_ENV === "production") {
    return (
      <div className="h-screen w-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <p className="text-slate-500 font-medium">Session expired or invalid.</p>
        <Button onClick={() => navigate("/")} variant="outline">Return to Dashboard</Button>
      </div>
    );
  }

  // --- Helper Functions for Dynamic UI ---
  const getScoreDetails = (score) => {
    if (score >= 80) return { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200", message: "Outstanding communication! Your pacing was natural, and your speech was clear and confident." };
    if (score >= 60) return { label: "Good", color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200", message: "Solid performance. To improve, try to reduce filler words and maintain a steadier speaking pace." };
    if (score >= 40) return { label: "Fair", color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-200", message: "You are getting there. Focus on structuring your answers and pausing intentionally instead of rushing." };
    return { label: "Needs Practice", color: "text-rose-600", bg: "bg-rose-100", border: "border-rose-200", message: "Keep practicing! Work on your vocal clarity, volume, and reducing long periods of silence." };
  };

  const details = getScoreDetails(finalScore);

  // Format duration from seconds to MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  // Mock data for the Radar Chart (You can map these to real backend data later)
  const performanceData = [
    { subject: "Fluency", A: Math.min(100, finalScore + 5), fullMark: 100 },
    { subject: "Pace", A: Math.max(0, finalScore - 10), fullMark: 100 },
    { subject: "Clarity", A: finalScore, fullMark: 100 },
    { subject: "Vocabulary", A: Math.min(100, finalScore + 12), fullMark: 100 },
    { subject: "Confidence", A: finalScore, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen w-screen bg-slate-50 p-6 md:p-12 font-sans flex flex-col items-center">
      
      {/* Header text */}
      <div className="w-full max-w-5xl mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Assessment Complete</h1>
          <p className="text-slate-500 mt-1">Review your automated speech analysis below.</p>
        </div>
        <Badge variant="outline" className={`${details.bg} ${details.color} ${details.border} px-4 py-1.5 text-sm font-semibold`}>
          {details.label}
        </Badge>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* --- LEFT COLUMN: Main Score & Summary --- */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Main Score Card */}
          <Card className="shadow-sm border-slate-200 text-center pt-6">
            <CardContent className="flex flex-col items-center">
              <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-[12px] border-slate-100 mb-4">
                {/* Simulated circular progress ring */}
                <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="44" 
                    fill="transparent" 
                    stroke="currentColor" 
                    strokeWidth="12" 
                    className={details.color}
                    strokeDasharray={`${(finalScore / 100) * 276.46} 276.46`} 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-extrabold text-slate-800">{finalScore}</span>
                  <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Score</span>
                </div>
              </div>
              <h2 className={`text-xl font-bold mt-2 ${details.color}`}>{details.label} Performance</h2>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-0 divide-y divide-slate-100">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <Clock className="text-indigo-500" size={20} />
                  <span className="font-medium">Total Duration</span>
                </div>
                <span className="font-semibold text-slate-800">{formatTime(duration)}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mic className="text-blue-500" size={20} />
                  <span className="font-medium">Audio Quality</span>
                </div>
                <span className="font-semibold text-emerald-600">Clear</span>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* --- RIGHT COLUMN: Chart & Detailed Feedback --- */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Chart Card */}
          <Card className="shadow-sm border-slate-200 h-[320px] flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target size={20} className="text-indigo-600"/>
                Speech Parameter Breakdown
              </CardTitle>
              <CardDescription>AI analysis of your vocal characteristics.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={performanceData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} />
                  <Radar name="Performance" dataKey="A" stroke="#4f46e5" strokeWidth={3} fill="#4f46e5" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Feedback Card */}
          <Card className="shadow-sm border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity size={20} className="text-indigo-600" />
                Actionable Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-100">
                {details.message}
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="flex-1 h-12 text-base bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200"
            >
              <Home className="mr-2" size={20} />
              Back to Dashboard
            </Button>
            <Button 
              onClick={() => navigate("/assessment")} 
              variant="outline" 
              className="flex-1 h-12 text-base border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="mr-2" size={20} />
              Retry Assessment
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Result;