import React, { useState, useEffect } from "react";
import Header from "./layout/Header";
import TechnicianDashboard from "./dashboard/TechnicianDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";
import BackOfficeDashboard from "./dashboard/BackOfficeDashboard";
import JobDetailModal from "./jobs/JobDetailModal";

interface HomeProps {
  initialUserRole?: "Technician" | "Administrator" | "BackOffice";
  userName?: string;
  userAvatar?: string;
}

const Home = ({
  initialUserRole = "Technician",
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
}: HomeProps) => {
  const [userRole, setUserRole] = useState<
    "Technician" | "Administrator" | "BackOffice"
  >(initialUserRole);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  // Toggle between roles for demonstration purposes
  const toggleUserRole = () => {
    setUserRole((prev) => {
      if (prev === "Technician") return "Administrator";
      if (prev === "Administrator") return "BackOffice";
      return "Technician";
    });
  };

  const handleLogout = () => {
    console.log("User logged out");
    // In a real implementation, this would handle the logout process
  };

  const handleViewJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsJobModalOpen(true);
  };

  const handleCloseJobModal = () => {
    setIsJobModalOpen(false);
    setSelectedJobId(null);
  };

  const handleApproveJob = () => {
    console.log(`Job ${selectedJobId} approved`);
    setIsJobModalOpen(false);
  };

  const handleRequestChanges = () => {
    console.log(`Changes requested for job ${selectedJobId}`);
    setIsJobModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        userRole={userRole}
        userName={userName}
        userAvatar={userAvatar}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {/* Role toggle button for demonstration */}
        <div className="container mx-auto px-4 py-2">
          <button
            onClick={toggleUserRole}
            className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full"
          >
            Switch to{" "}
            {userRole === "Technician" ? "Administrator" : "Technician"} View
          </button>
        </div>

        {userRole === "Technician" ? (
          <TechnicianDashboard userName={userName} />
        ) : userRole === "Administrator" ? (
          <AdminDashboard userName={userName} userRole={userRole} />
        ) : (
          <BackOfficeDashboard userName={userName} userRole={userRole} />
        )}
      </main>

      {/* Job Detail Modal */}
      {isJobModalOpen && selectedJobId && (
        <JobDetailModal
          isOpen={isJobModalOpen}
          onClose={handleCloseJobModal}
          onApprove={handleApproveJob}
          onRequestChanges={handleRequestChanges}
          job={{
            id: selectedJobId,
            title: "Electrical Outlet Repair",
            description: "Replace damaged electrical outlet in conference room",
            status: "completed",
            category: "electrical",
            location: "Building A, Floor 2, Room 201",
            technician: {
              id: "TECH-001",
              name: userName,
              avatar: userAvatar,
            },
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            beforePhotos: [
              "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80",
              "https://images.unsplash.com/photo-1558424871-c0cc1e88f736?w=600&q=80",
            ],
            afterPhotos: [
              "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80",
              "https://images.unsplash.com/photo-1600566752447-f4e219736194?w=600&q=80",
            ],
            materials: [
              { name: "Electrical Outlet", quantity: 1, unit: "pc" },
              { name: "Electrical Tape", quantity: 1, unit: "roll" },
              { name: "Wire Connectors", quantity: 4, unit: "pcs" },
            ],
            notes:
              "Customer reported intermittent power issues. Replaced outlet and tested functionality.",
          }}
        />
      )}
    </div>
  );
};

export default Home;
