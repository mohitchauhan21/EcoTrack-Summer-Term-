import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  Shield, Sparkles, TrendingDown, Lightbulb, Zap, Leaf, 
  BarChart3, Target, Send, Bot, User, Globe, 
  LineChart, Activity, DollarSign, TreePine,
  ArrowRight, AlertTriangle, CheckCircle2, RefreshCw
} from "lucide-react";
import apiClient from "../../api/axiosClient";

interface Insight {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "reduction" | "efficiency" | "reporting" | "compliance";
  potential: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const categoryIcons: Record<string, React.ReactNode> = {
  reduction: <TrendingDown className="w-4 h-4" />,
  efficiency: <Zap className="w-4 h-4" />,
  reporting: <BarChart3 className="w-4 h-4" />,
  compliance: <Shield className="w-4 h-4" />,
};

const impactColors = {
  high: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", label: "High Impact" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", label: "Medium Impact" },
  low: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", label: "Low Impact" },
};

const sampleInsights: Insight[] = [
  {
    id: "1",
    title: "Switch to Renewable Energy",
    description: "Your Utilities category accounts for 45% of total emissions. Switching to renewable energy suppliers could reduce emissions by up to 60% in this category.",
    impact: "high",
    category: "reduction",
    potential: "~270 tCO2e/year"
  },
  {
    id: "2",
    title: "Optimize Logistics Routes",
    description: "Logistics department shows 2x higher fuel consumption than industry benchmarks. Implementing route optimization could reduce travel emissions by 25%.",
    impact: "high",
    category: "efficiency",
    potential: "~85 tCO2e/year"
  },
  {
    id: "3",
    title: "Automated Report Scheduling",
    description: "Set up automated weekly emissions reports to track progress and identify trends before they become problems.",
    impact: "medium",
    category: "reporting",
    potential: "Time savings"
  },
  {
    id: "4",
    title: "Supply Chain Audit",
    description: "Supply Chain emissions have increased 15% quarter-over-quarter. Consider auditing your top 5 suppliers for sustainability practices.",
    impact: "medium",
    category: "compliance",
    potential: "Risk reduction"
  },
  {
    id: "5",
    title: "Implement LED Lighting",
    description: "Replacing traditional lighting with LED across all facilities could reduce Utilities emissions by approximately 40%.",
    impact: "medium",
    category: "reduction",
    potential: "~45 tCO2e/year"
  },
  {
    id: "6",
    title: "Carbon Offset Program",
    description: "Based on your current emission levels, investing in certified carbon offset projects could help achieve net-zero status by 2030.",
    impact: "low",
    category: "compliance",
    potential: "Strategic"
  },
];


export default function EcoInsightsPage() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<"insights" | "assistant">("insights");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your EcoTrack AI assistant. I can help you analyze your emissions data, suggest reduction strategies, and answer questions about your carbon footprint. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await apiClient.get("/analytics/summary");
        setSummary(res.data);
      } catch {}
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate AI response (since @google/genai needs API key)
    setTimeout(() => {
      const responses = [
        "Based on your emissions data, I recommend focusing on reducing your Utilities consumption first. It's currently your largest emission source. Consider conducting an energy audit to identify the biggest savings opportunities.",
        "Looking at your department data, Logistics has the highest emissions per employee. I suggest implementing a green logistics program including route optimization and electric vehicle transition.",
        "Your current emission trends show a 5% reduction this quarter compared to last. Great progress! To accelerate, consider setting up automated reporting and engaging departments in reduction challenges.",
        "I can help you create a carbon reduction roadmap. Would you like me to generate a step-by-step plan broken down by department and timeline?",
        "Comparing your metrics to industry benchmarks, your Supply Chain emissions are 20% higher than similar companies. This could be an opportunity for supplier engagement programs.",
      ];
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 1500);
  };

  const canView = role === "admin" || role === "superadmin" || role === "executive";

  if (!canView) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-12">
          <Bot className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-xl text-zinc-100 font-light mb-2">AI Insights</h2>
          <p className="text-zinc-500 text-sm">Executive and admin access required to view AI-powered insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6 pb-12">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-light text-zinc-100 mb-1">Eco Insights</h1>
          <p className="text-zinc-500 text-sm">AI-powered analysis and recommendations for your carbon footprint.</p>
        </div>
        <div className="flex bg-[#0f0f0f] border border-white/5 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "insights" 
                ? "bg-emerald-500/10 text-emerald-400 shadow-sm" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Insights
          </button>
          <button
            onClick={() => setActiveTab("assistant")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "assistant" 
                ? "bg-emerald-500/10 text-emerald-400 shadow-sm" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Bot className="w-4 h-4 inline mr-2" />
            AI Assistant
          </button>
        </div>
      </div>

      {activeTab === "insights" ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-6 col-span-full flex flex-col items-center text-center">
            <Sparkles className="w-8 h-8 text-emerald-500 mb-3" />
            <h3 className="text-zinc-100 font-medium">AI Insights Coming Soon</h3>
            <p className="text-sm text-zinc-500 mt-1">We are generating personalized recommendations based on your data.</p>
          </div>
        </div>
      ) : (
        <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-6 flex flex-col items-center text-center">
          <Bot className="w-8 h-8 text-blue-500 mb-3" />
          <h3 className="text-zinc-100 font-medium">AI Assistant Coming Soon</h3>
          <p className="text-sm text-zinc-500 mt-1">The AI assistant is being prepared for you.</p>
        </div>
      )}
    </div>
  );
}
