import React, { useState } from "react";
import ManualEntryForm from "../../components/data/ManualEntryForm";
import CsvUploader from "../../components/data/CsvUploader";
import LogsTable from "../../components/data/LogsTable";
import FilterBar from "../../components/dashboard/FilterBar";
import { useAuth } from "../../context/AuthContext";

export default function CarbonLogsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingLog, setEditingLog] = useState<any | null>(null);
  const { role } = useAuth();

  const handleDataAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setEditingLog(null);
  };

  return (
    <div className="max-w-6xl space-y-10 pb-12">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-3xl font-light dark:text-zinc-100 text-gray-900 mb-2">
          {role === 'employee' ? 'My Data Entries' : 'Carbon Logs'}
        </h1>
        <p className="dark:text-zinc-500 text-gray-500 text-sm">
          {role === 'employee' ? 'Manage your department carbon logs.' : 'Manage corporate carbon logs and import bulk data.'}
        </p>
      </div>

      {/* 2. Data Entry Section */}
      <div className={`grid grid-cols-1 ${role !== 'employee' ? 'lg:grid-cols-2' : ''} gap-6 items-stretch`}>
        <ManualEntryForm 
          onSuccess={handleDataAdded} 
          editingLog={editingLog} 
          onCancelEdit={() => setEditingLog(null)} 
        />
        {role !== 'employee' && <CsvUploader onSuccess={handleDataAdded} />}
      </div>

      <div className="space-y-6 pt-2">
        {/* 3. Action Toolbar */}
        <FilterBar hideLogEntry />
        
        {/* 4. Emission Logs Table */}
        <div>
          <LogsTable 
            refreshTrigger={refreshTrigger} 
            onEdit={(log) => setEditingLog(log)}
          />
        </div>
      </div>
    </div>
  );
}
