// app/admin/page.tsx
import React from "react";
import { LayoutDashboard } from "lucide-react";

const AdminDashboardPage = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
          <LayoutDashboard size={32} />
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome! Here's an overview of your store.
        </p>
      </div>

      {/* You can add stats, charts, or recent activity here later */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">THIS IS THE DASHBOARD PAGE</h2>
        <p className="mt-2 text-gray-600">
          The content for your main admin dashboard will go here.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
