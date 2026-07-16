import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanyBoundariesStep from "../components/onboarding/CompanyBoundariesStep";
import DepartmentTaggingStep from "../components/onboarding/DepartmentTaggingStep";
import apiClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [companyCreated, setCompanyCreated] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const checkOnboardingState = async () => {
      try {
        const companyRes = await apiClient.get("/company");
        if (companyRes.data) {
          const deptRes = await apiClient.get("/departments");
          if (deptRes.data && deptRes.data.length > 0) {
            navigate("/dashboard");
          } else {
            setCompanyCreated(true);
            setStep(2);
            login({ companyName: companyRes.data.name, role: "admin", userName: "Admin User" });
          }
        }
      } catch (error: any) {
        // Company doesn't exist yet, proceed with onboarding step 1
      }
    };
    checkOnboardingState();
  }, [navigate, login]);

  const handleCompanyComplete = async (
    name: string,
    region: string,
    carbonTarget: number,
    reportingFrequency: string,
    anomalyThreshold: number
  ) => {
    try {
      await apiClient.post("/company", {
        name,
        region,
        carbonTarget,
        reportingFrequency,
        anomalyThreshold
      });
      setCompanyCreated(true);
      login({ companyName: name, role: "admin", userName: "Admin User" });
      setStep(2);
    } catch (error) {
      console.error("Failed to create company", error);
    }
  };

  const handleCompleteSetup = async () => {
    try {
      const depts = await apiClient.get("/departments");
      if (depts.data.length > 0) {
        navigate("/dashboard");
      } else {
        alert("Please add at least one department tag to continue.");
      }
    } catch (error) {
      console.error("Error verifying departments", error);
    }
  };

  return (
    <div className="flex-1 bg-[#050505] pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-zinc-100 tracking-tight">Welcome to EcoTrack</h1>
          <p className="text-zinc-500 mt-2">Let's set up your workspace before we dive into the data.</p>
        </div>

        {/* Stepper progress bar */}
        <div className="flex items-center justify-between bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-zinc-800 text-zinc-500 border border-white/10"}`}>
              1
            </div>
            <span className={`text-sm font-medium ${step >= 1 ? "text-zinc-100" : "text-zinc-500"}`}>Company Boundaries</span>
          </div>
          <div className="flex-grow mx-4 h-px bg-white/5" />
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-zinc-900 text-zinc-500 border border-white/10"}`}>
              2
            </div>
            <span className={`text-sm font-medium ${step >= 2 ? "text-zinc-100" : "text-zinc-500"}`}>Departments Setup</span>
          </div>
        </div>

        {step === 1 ? (
          <CompanyBoundariesStep onComplete={handleCompanyComplete} />
        ) : (
          <DepartmentTaggingStep />
        )}

        <div className="pt-6">
          <button
            onClick={handleCompleteSetup}
            disabled={step !== 2}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-bold uppercase tracking-wide py-4 rounded-xl transition-colors"
          >
            COMPLETE SETUP & LAUNCH DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );
}
