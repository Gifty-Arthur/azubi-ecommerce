import React from "react";

const AdminPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {/* Corrected the unescaped apostrophe */}
      <p>
        Welcome to the admin dashboard. Here you&apos;ll find tools to manage
        your store.
      </p>
      {/* Add links to your other admin pages here */}
    </div>
  );
};

export default AdminPage;
