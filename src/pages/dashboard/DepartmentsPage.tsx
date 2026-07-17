import React from 'react';
import { Tags } from 'lucide-react';
import CompanyDepartmentsTab from '../../components/dashboard/CompanyDepartmentsTab';

export default function DepartmentsPage() {
  return (
    <div className="pb-12">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Tags className="w-4.5 h-4.5 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-light dark:text-zinc-50 text-gray-950 tracking-tight">Departments</h1>
        </div>
        <p className="dark:text-zinc-500 text-gray-500 text-sm ml-12">
          Manage your organization's departments and team structure.
        </p>
      </header>
      <CompanyDepartmentsTab />
    </div>
  );
}
