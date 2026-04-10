import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../commons/Navbar";
import api from "@/api/api";
import { startAssessment } from "@/redux/features/assessmentSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LayoutDashboard, History, PlayCircle, Clock, CheckCircle2, TrendingUp, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { setResults } from "@/redux/features/resultSlice";

export default function Dashboard() {
 const [activeTab, setActiveTab] = useState("assessments");
  const [isStarting, setIsStarting] = useState(false);
  
  // Fix 1: Use local state for history to prevent infinite loading bugs
  const [historyData, setHistoryData] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const res = await api.get("/assessment/history");
        
        // Ensure we are grabbing the array correctly from your ApiResponse
        const fetchedHistory = res.data.data || res.data;
        setHistoryData(fetchedHistory);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      const res = await api.post("/assessment/start");
      const { sessionId, question, totalQuestions } = res.data.data;

      // Dispatch to Redux store
      dispatch(startAssessment({ sessionId, question, totalQuestions }));

      toast.success("Assessment started successfully!");
      navigate("/interview", { 
        state: { sessionId, question, totalQuestions } 
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to start assessment. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

function HistoryView({ history, loading }) {
    const navigate = useNavigate();

    // Fix 2: Check the explicit loading boolean, not the array length
    if (loading) {
      return <p className="text-center py-10 text-slate-500 font-medium animate-pulse">Loading history...</p>;
    }

    if (!history || history.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-700">No history yet</h3>
          <p className="text-slate-500 mt-1">Take your first interview to see your results here!</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-slate-600">
              <th className="px-6 py-4">Assessment</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {history.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">Interview Practice</td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-800">{item.totalScore}</span> / 100
                </td>
                <td className="px-6 py-4">
                  {/* Fix 3: This navigate relies on the URL param we set up in Result.jsx! */}
                  <button
                    onClick={() => navigate(`/result/${item._id}`)}
                    className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                  >
                    View Details &rarr;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-24 pb-12">
        
        {/* --- PAGE HEADER --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your practice sessions and track your speaking confidence.</p>
        </div>

        {/* --- CUSTOM TABS NAVIGATION --- */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-px">
          <button
            onClick={() => setActiveTab("assessments")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === "assessments"
                ? "border-[#162456] text-[#162456]"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <LayoutDashboard size={18} />
            Available Assessments
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === "history"
                ? "border-[#162456] text-[#162456]"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <History size={18} />
            My History
          </button>
        </div>

        {/* --- TAB CONTENT --- */}
        <div className="mt-4">
          
          {/* 1. ASSESSMENTS TAB */}
          {activeTab === "assessments" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Primary Assessment Card */}
              <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                    <PlayCircle className="text-indigo-600" size={24} />
                  </div>
                  <CardTitle className="text-xl">Standard Interview Practice</CardTitle>
                  <CardDescription>
                    A comprehensive evaluation of your fluency, pacing, and confidence.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 text-sm text-slate-600 mb-2">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-400"/> Est. 10 Minutes
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-slate-400"/> AI Confidence Scoring
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleStart} 
                    disabled={isStarting}
                    className="w-full text-white bg-[#162456] hover:bg-[#243882] shadow-md transition-all"
                  >
                    {isStarting ? "Loading..." : "Start Assessment"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="shadow-sm border-slate-200 bg-slate-50/50 border-dashed flex flex-col items-center justify-center text-center p-6 opacity-70">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-slate-400" size={24} />
                </div>
                <h3 className="font-semibold text-slate-700">More Coming Soon</h3>
                <p className="text-sm text-slate-500 mt-1">New specialized assessments are being added.</p>
              </Card>

            </div>
          )}

{activeTab === "history" && (
            <HistoryView history={historyData} loading={isLoadingHistory} />
          )}

        </div>
      </main>
    </div>
  );
}