import React, { useState } from "react";
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

  const handleCompanyComplete = async (name: string, region: string) => {
    try {
      await apiClient.post("/company", { name, region });
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

        <CompanyBoundariesStep onComplete={handleCompanyComplete} />
        
        {step === 2 && (
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
