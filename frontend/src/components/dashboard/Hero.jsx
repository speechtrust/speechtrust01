import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../commons/Navbar";
import api from "@/api/api";
import { startAssessment } from "@/redux/features/assessmentSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LayoutDashboard, History, PlayCircle, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

export default function Dashboard() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

 const [activeTab, setActiveTab] = useState(location.state?.defaultTab || "assessments");
  const [isStarting, setIsStarting] = useState(false);
  
  const [historyData, setHistoryData] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  
  const [availableAssessments, setAvailableAssessments] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const res = await api.get("/assessment/history");
        const fetchedHistory = res.data.data || res.data;
        setHistoryData(fetchedHistory);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    const fetchAssessments = async () => {
      try {
        const res = await api.get("/assessment/all");
        setAvailableAssessments(res.data.data);
      } catch (err) {
        console.error("Failed to fetch assessments:", err);
      }
    };

    fetchHistory();
    fetchAssessments();
  }, []);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      const res = await api.post("/assessment/start", { assessmentId: selectedAssessmentId });
      const { sessionId, question, totalQuestions } = res.data.data;

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
      setShowInstructions(false);
    }
  };

  function HistoryView({ history, loading }) {
    const navigate = useNavigate();

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
                <td className="px-6 py-4 font-medium text-slate-800">Completed Assessment</td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-800">{item.totalScore}</span> / 100
                </td>
                <td className="px-6 py-4">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your practice sessions and track your speaking confidence.</p>
        </div>

        <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-8">
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

        <div className="mt-4">
          {activeTab === "assessments" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {availableAssessments.map((assessment) => (
                <Card key={assessment._id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                      <PlayCircle className="text-indigo-600" size={24} />
                    </div>
                    <CardTitle className="text-xl">{assessment.title}</CardTitle>
                    <CardDescription>
                      {assessment.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2 text-sm text-slate-600 mb-2">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-400"/> Est. {assessment.estimatedMinutes} Minutes
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-slate-400"/> AI Confidence Scoring
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => {
                        setSelectedAssessmentId(assessment._id);
                        setShowInstructions(true);
                      }} 
                      disabled={isStarting}
                      className="w-full text-white bg-[#162456] hover:bg-[#243882] shadow-md transition-all"
                    >
                      Start Assessment
                    </Button>
                  </CardFooter>
                </Card>
              ))}

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
        
        <InstructionsModal 
          isOpen={showInstructions} 
          onClose={() => setShowInstructions(false)} 
          onStart={handleStart} 
          isStarting={isStarting} 
        />
        
      </main>
    </div>
  );
}

function InstructionsModal({ isOpen, onClose, onStart, isStarting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#162456] p-6 text-white">
          <h2 className="text-2xl font-bold">Assessment Instructions</h2>
          <p className="text-indigo-100 mt-1 text-sm">Please read carefully before starting.</p>
        </div>
        
        <div className="p-6 space-y-4 text-slate-600 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-[#162456] flex items-center justify-center shrink-0 font-bold">1</div>
            <p><strong>Environment:</strong> Ensure you are in a quiet room. Background noise will negatively affect your final confidence score.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-[#162456] flex items-center justify-center shrink-0 font-bold">2</div>
            <p><strong>Reading Phase:</strong> You will have 10 seconds to read each question. Use this time to structure your thoughts.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-[#162456] flex items-center justify-center shrink-0 font-bold">3</div>
            <p><strong>Recording Phase:</strong> Your microphone will turn on automatically. Speak clearly. Avoid using filler words like "um" or "like".</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-[#162456] flex items-center justify-center shrink-0 font-bold">4</div>
            <p><strong>Early Submission:</strong> If you finish answering before the timer runs out, click "Submit Answer" to move to the next question.</p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isStarting}>
            Cancel
          </Button>
          <Button onClick={onStart} disabled={isStarting} className="bg-[#162456] hover:bg-[#243882] text-white">
            {isStarting ? "Preparing System..." : "I'm Ready - Start Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}