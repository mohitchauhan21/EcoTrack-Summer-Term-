import React, { useState } from "react";
import ManualEntryForm from "../components/data/ManualEntryForm";
import CsvUploader from "../components/data/CsvUploader";
import LogsTable from "../components/data/LogsTable";
import FilterBar from "../components/dashboard/FilterBar";
import { useAuth } from "../context/AuthContext";

export default function DataManagementPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { role } = useAuth();

  const handleDataAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex-1 bg-zinc-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1024px] mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-light dark:text-zinc-100 text-gray-900">
            {role === 'employee' ? 'My Data Entries' : 'Data Management Portal'}
          </h1>
          <p className="dark:text-zinc-500 text-gray-500 text-sm mt-1">
            {role === 'employee' ? 'Manage your department carbon logs.' : 'Manage corporate carbon logs and import bulk data.'}
          </p>
        </div>

        <div className={`grid grid-cols-1 ${role !== 'employee' ? 'lg:grid-cols-2' : ''} gap-6`}>
          <ManualEntryForm onSuccess={handleDataAdded} />
          {role !== 'employee' && <CsvUploader onSuccess={handleDataAdded} />}
        </div>

        <div className="pt-6">
          <FilterBar />
          <div className="mt-6">
            <LogsTable refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
}
