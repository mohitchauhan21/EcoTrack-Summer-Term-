import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DepartmentTaggingStep from "../components/onboarding/DepartmentTaggingStep";
import apiClient from "../api/axiosClient";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  const [deptCount, setDeptCount] = useState(0);

  useEffect(() => {
    // By the time someone reaches this page, register() has already created
    // their company and logged them in — this step only needs the companyId
    // so DepartmentTaggingStep doesn't have to re-fetch it on every tag add.
    apiClient.get("/company")
      .then((res) => setCompanyId(res.data._id))
      .catch((err) => console.error("Failed to fetch company", err));

    refreshDeptCount();
  }, []);

  const refreshDeptCount = async () => {
    try {
      const res = await apiClient.get("/departments");
      setDeptCount(res.data.length);
    } catch (error) {
      console.error("Error checking departments", error);
    }
  };

  const handleCompleteSetup = () => {
    if (deptCount > 0) {
      navigate("/dashboard");
    } else {
      alert("Please add at least one department tag to continue.");
    }
  };

  return (
    <div className="flex-1 bg-[#050505] pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-light dark:text-zinc-100 text-gray-900 tracking-tight">Welcome to EcoTrack</h1>
          <p className="dark:text-zinc-500 text-gray-500 mt-2">One more step — tag your departments before we dive into the data.</p>
        </div>

        <DepartmentTaggingStep companyId={companyId} onTagsChanged={refreshDeptCount} />

        <div className="pt-6">
          <button
            onClick={handleCompleteSetup}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wide py-4 rounded-xl transition-colors"
          >
            COMPLETE SETUP & LAUNCH DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );
}
