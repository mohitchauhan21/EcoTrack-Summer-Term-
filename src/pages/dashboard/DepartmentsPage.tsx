import React from 'react';
import { Navigate } from 'react-router-dom';

export default function DepartmentsPage() {
  return <Navigate to="/dashboard/company" replace />;
}
