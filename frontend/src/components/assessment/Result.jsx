import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Clock,
  Target,
  Mic,
  Activity,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { useParams } from "react-router-dom";
import api from "@/api/api";
import { useEffect, useState } from "react";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { id } = useParams();

  const [resultData, setResultData] = useState(location.state || null);
  const [isLoading, setIsLoading] = useState(!location.state);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!location.state && id) {
        try {
          const res = await api.get(`/assessment/result/${id}`);
          setResultData(res.data.data);
        } catch (err) {
          console.error("Failed to fetch session details", err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchSessionData();
  }, [id, location.state]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-medium animate-pulse">
          Loading analysis...
        </p>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <p className="text-slate-500 font-medium">
          Session expired or not found.
        </p>
        <Button onClick={() => navigate("/dashboard")} variant="outline">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const { finalScore = 0, duration = 0, attempts = [] } = resultData;

  const getScoreDetails = (score) => {
    if (score >= 80)
      return {
        label: "Excellent",
        color: "text-emerald-600",
        bg: "bg-emerald-100",
        border: "border-emerald-200",
        message:
          "Outstanding communication! Your pacing was natural, and your speech was clear and confident.",
      };
    if (score >= 60)
      return {
        label: "Good",
        color: "text-blue-600",
        bg: "bg-blue-100",
        border: "border-blue-200",
        message:
          "Solid performance. To improve, try to reduce filler words and maintain a steadier speaking pace.",
      };
    if (score >= 40)
      return {
        label: "Fair",
        color: "text-amber-600",
        bg: "bg-amber-100",
        border: "border-amber-200",
        message:
          "You are getting there. Focus on structuring your answers and pausing intentionally instead of rushing.",
      };
    return {
      label: "Needs Practice",
      color: "text-rose-600",
      bg: "bg-rose-100",
      border: "border-rose-200",
      message:
        "Keep practicing! Work on your vocal clarity, volume, and reducing long periods of silence.",
    };
  };

const avg = (key) => {
    if (!attempts.length) return 0;
    return (
      attempts.reduce((sum, a) => sum + (a.metrics?.[key] || 0), 0) /
      attempts.length
    );
  };

  const analytics = resultData.analytics || {
    filler_count: Math.round(avg("filler_count")),
    words_per_second: avg("words_per_second"),
    relevance: avg("relevance_similarity"),
    pause_count: Math.round(avg("long_pause_count")),
  };

  const generateFeedback = (analytics, score) => {
    if (!analytics) return "No analysis available.";

    let feedback = [];

    if (analytics.filler_count > 8) {
      feedback.push(
        "You used a high number of filler words. Try to pause instead of using fillers like 'um' or 'uh'.",
      );
    } else if (analytics.filler_count > 3) {
      feedback.push(
        "You used some filler words. Reducing them will make your speech more polished.",
      );
    }

    if (analytics.words_per_second < 1.5) {
      feedback.push(
        "Your speaking pace was a bit slow. Try to speak more naturally and confidently.",
      );
    } else if (analytics.words_per_second > 3.5) {
      feedback.push(
        "You were speaking too fast. Slowing down will improve clarity.",
      );
    } else {
      feedback.push("Your speaking pace was well balanced.");
    }

    if (analytics.relevance < 0.2) {
      feedback.push(
        "Your answers were not very relevant to the questions. Focus on addressing the question directly.",
      );
    } else if (analytics.relevance < 0.4) {
      feedback.push(
        "Your answers were somewhat relevant. Try to stay more on topic.",
      );
    } else {
      feedback.push(
        "Your answers were relevant and well-aligned with the questions.",
      );
    }

    // ⏱ Pauses
    if (analytics.pause_count > 5) {
      feedback.push(
        "You had frequent long pauses. Try to maintain a smoother flow while speaking.",
      );
    } else if (analytics.pause_count > 2) {
      feedback.push(
        "There were some noticeable pauses. Improving fluency will help.",
      );
    }

    if (score > 80) {
      feedback.push("Overall, excellent performance. Keep it up!");
    } else if (score > 60) {
      feedback.push("Good performance with room for improvement.");
    } else {
      feedback.push(
        "You need more practice to improve confidence and clarity.",
      );
    }

    return feedback.join(" ");
  };

  const details = getScoreDetails(finalScore);
  const aiFeedback = generateFeedback(analytics, finalScore);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

const clamp = (val) => Math.max(0, Math.min(100, val));

  const performanceData = [
    {
      subject: "Fluency",
      A: clamp(Math.round(avg("words_per_second") * 20)),
      fullMark: 100,
    },
    {
      subject: "Pauses",
      A: clamp(Math.round(100 - avg("silence_ratio") * 100)),
      fullMark: 100,
    },
    {
      subject: "Relevance",
      A: clamp(Math.round(avg("relevance_similarity") * 100)),
      fullMark: 100,
    },
    {
      subject: "Clarity",
      A: clamp(Math.round(100 - avg("filler_count") * 10)),
      fullMark: 100,
    },
    { 
      subject: "Confidence", 
      A: clamp(finalScore), 
      fullMark: 100 
    },
  ];

  return (
    <div className="min-h-screen w-screen bg-slate-50 p-6 md:p-12 font-sans flex flex-col items-center">
      {/* Header text */}
      <div className="w-full max-w-5xl mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Assessment Complete
          </h1>
          <p className="text-slate-500 mt-1">
            Review your automated speech analysis below.
          </p>
        </div>
        <Badge
          variant="outline"
          className={`${details.bg} ${details.color} ${details.border} px-4 py-1.5 text-sm font-semibold`}
        >
          {details.label}
        </Badge>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          {/* Main Score Card */}
          <Card className="shadow-sm border-slate-200 text-center pt-6">
            <CardContent className="flex flex-col items-center">
              <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-[12px] border-slate-100 mb-4">
                {/* Simulated circular progress ring */}
                <svg
                  className="absolute top-0 left-0 w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="12"
                    className={details.color}
                    strokeDasharray={`${(finalScore / 100) * 276.46} 276.46`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-extrabold text-slate-800">
                    {finalScore}
                  </span>
                  <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                    Score
                  </span>
                </div>
              </div>
              <h2 className={`text-xl font-bold mt-2 ${details.color}`}>
                {details.label} Performance
              </h2>
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
                <span className="font-semibold text-slate-800">
                  {formatTime(duration)}
                </span>
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
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle>Speech Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700">
              <p>Filler Words: {analytics.filler_count}</p>
<p>Speech Rate: {analytics.words_per_second} words/sec</p>
              <p>Pauses: {analytics.pause_count}</p>
              <p>
                <p>Relevance: {(analytics.relevance * 100).toFixed(1)}%</p>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Chart Card */}
          <Card className="shadow-sm border-slate-200 h-[320px] flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target size={20} className="text-indigo-600" />
                Speech Parameter Breakdown
              </CardTitle>
              <CardDescription>
                AI analysis of your vocal characteristics.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  data={performanceData}
                >
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }}
                  />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fill="#4f46e5"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity size={20} className="text-indigo-600" />
                Actionable Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-100">
                {aiFeedback}
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={() => navigate("/dashboard", { state: { defaultTab: "history" } })}
              className="flex-1 h-12 text-base bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200"
            >
              <Home className="mr-2" size={20} />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
