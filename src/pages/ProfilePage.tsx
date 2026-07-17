import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/axiosClient";
import { User, Building, MapPin, Tag } from "lucide-react";

export default function ProfilePage() {
  const { userName, companyName, departmentId, role } = useAuth();
  const [departmentName, setDepartmentName] = useState("Loading...");

  useEffect(() => {
    const fetchDept = async () => {
      if (departmentId) {
        try {
          const res = await apiClient.get("/departments");
          const dept = res.data.find((d: any) => d._id === departmentId);
          setDepartmentName(dept ? dept.name : "Unknown Department");
        } catch (error) {
          setDepartmentName("Error loading department");
        }
      } else {
        setDepartmentName("N/A");
      }
    };
    fetchDept();
  }, [departmentId]);

  return (
    <div className="flex-1 bg-[#050505] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-light dark:text-zinc-100 text-gray-900">User Profile</h1>
          <p className="dark:text-zinc-500 text-gray-500 mt-1 text-sm">Your personal account details.</p>
        </div>

        <div className="dark:bg-[#0f0f0f] bg-white border dark:border-white/5 border-gray-200 rounded-2xl p-8">
          <div className="flex items-center space-x-6 mb-8 border-b dark:border-white/5 border-gray-200 pb-8">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-3xl font-bold text-black uppercase">
              {userName ? userName.charAt(0) : "U"}
            </div>
            <div>
              <h2 className="text-2xl font-light dark:text-zinc-100 text-gray-900 tracking-tight">{userName || "Client User"}</h2>
              <p className="dark:text-zinc-500 text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Role: {role}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full dark:bg-zinc-900 bg-gray-50 border dark:border-white/10 border-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Email Address</p>
                <p className="dark:text-zinc-200 text-gray-800 font-medium text-sm mt-1">{role ? `${role}@ecotrack.com` : "user@ecotrack.com"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full dark:bg-zinc-900 bg-gray-50 border dark:border-white/10 border-gray-200 flex items-center justify-center">
                <Building className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Company</p>
                <p className="dark:text-zinc-200 text-gray-800 font-medium text-sm mt-1">{companyName || "Acme Corporation"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full dark:bg-zinc-900 bg-gray-50 border dark:border-white/10 border-gray-200 flex items-center justify-center">
                <Tag className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold dark:text-zinc-500 text-gray-500">Assigned Department</p>
                <p className="dark:text-zinc-200 text-gray-800 font-medium text-sm mt-1">{departmentName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
