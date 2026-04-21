import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../commons/Navbar';
import { ArrowRight, Activity, BrainCircuit, LineChart, Mic } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <Navbar />

      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex items-center justify-center text-center px-6">
        
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40"
             style={{
               backgroundImage: "radial-gradient(circle, rgba(79, 70, 229, 0.15) 1px, transparent 1px)",
               backgroundSize: "32px 32px",
               maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 80%)"
             }}
        />
<div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px]" />
<div className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            AI-Powered Voice Analysis
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Master your speaking <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-blue-500">
              confidence.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
            Eliminate subjective bias. Record your interview responses and let our advanced speech processing models evaluate your fluency, pacing, and confidence in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button 
              onClick={() => navigate("/dashboard")} 
              className="px-8 py-4 rounded-xl font-semibold text-lg hover:-translate-y-1 transition-all duration-200 shadow-xl flex items-center justify-center gap-2"
              >
              Start Free Evaluation <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-xl bg-white text-slate-700 font-semibold text-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
              >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-white border-t border-slate-100 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Objective evaluation for modern professionals.</h2>
            <p className="text-lg text-slate-500">
              Tradiotional confidence assessment is subjective and inconsistent. SpeechTrust uses advanced NLP and audio processing to analyze exactly how you speak, not just what you say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <BrainCircuit className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Acoustic Analysis</h3>
              <p className="text-slate-600 leading-relaxed">
                Our system extracts measurable speech characteristics like pause duration, pitch variation, and speaking rate to determine your natural speaking rhythm.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Activity className="text-indigo-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Confidence Scoring</h3>
              <p className="text-slate-600 leading-relaxed">
                Receive an immediate, objective score between 0 and 100. We analyze your fluency and word usage to grade your communication skills without human bias.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <LineChart className="text-emerald-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Progress Tracking</h3>
              <p className="text-slate-600 leading-relaxed">
                Review your historical assessments through a secure dashboard. Identify patterns in your speech and track your improvement over time for upcoming interviews.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- SIMPLE FOOTER --- */}
      <footer className="bg-slate-900 py-10 text-center text-slate-400 border-t border-slate-800">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Mic size={20} className="text-indigo-400" />
          <span className="text-xl font-bold text-white tracking-tight">SpeechTrust</span>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} Voice-Based Confidence Evaluation System.</p>
      </footer>
    </div>
  );
}