import React, { useState } from "react";
import MetricsSummary from "./MetricsSummary";
import ServiceCategoryTabs from "./ServiceCategoryTabs";
import AdminJobList from "./AdminJobList";
import CreateJobForm from "../jobs/CreateJobForm";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

// Let's check if we need to create a JobDetailModal component
interface JobDetailModalProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Create a simple JobDetailModal component since we can't import it
const JobDetailModal: React.FC<JobDetailModalProps> = ({
  jobId,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Job Details: {jobId}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">Loading job details...</p>
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Approve Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AdminDashboardProps {
  userName?: string;
  userRole?: string;
}

const AdminDashboard = ({
  userName = "Admin User",
  userRole = "Administrator",
}: AdminDashboardProps) => {
  const [selectedCategory, setSelectedCategory] = useState("electrical");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateJobForm, setShowCreateJobForm] = useState(false);

  // Mock data for metrics
  const metricsData = {
    totalJobs: 124,
    completedJobs: 87,
    pendingJobs: 37,
    technicians: 12,
    serviceCategories: [
      { name: "Electrical", count: 32, percentage: 26 },
      { name: "Plumbing", count: 28, percentage: 23 },
      { name: "AC Repair", count: 24, percentage: 19 },
      { name: "Painting", count: 22, percentage: 18 },
      { name: "Carpentry", count: 18, percentage: 14 },
    ],
  };

  // Mock data for service categories
  const categoryData = [
    {
      id: "electrical",
      name: "Electrical",
      count: 32,
      icon: <span className="text-yellow-500">⚡</span>,
    },
    {
      id: "plumbing",
      name: "Plumbing",
      count: 28,
      icon: <span className="text-blue-500">🚿</span>,
    },
    {
      id: "ac-repair",
      name: "AC Repair",
      count: 24,
      icon: <span className="text-cyan-500">❄️</span>,
    },
    {
      id: "painting",
      name: "Painting",
      count: 22,
      icon: <span className="text-purple-500">🎨</span>,
    },
    {
      id: "carpentry",
      name: "Carpentry",
      count: 18,
      icon: <span className="text-amber-700">🔨</span>,
    },
  ];

  // Mock jobs data
  const jobsData = [
    {
      id: "JOB-1001",
      title: "Electrical Panel Repair",
      location: "Building A, Floor 3",
      technician: "John Smith",
      category: "Electrical",
      status: "completed" as const,
      date: "2023-06-15",
    },
    {
      id: "JOB-1002",
      title: "Plumbing Leak Fix",
      location: "Building B, Floor 1",
      technician: "Maria Rodriguez",
      category: "Plumbing",
      status: "in-progress" as const,
      date: "2023-06-18",
    },
    {
      id: "JOB-1003",
      title: "AC Unit Maintenance",
      location: "Building C, Floor 2",
      technician: "David Chen",
      category: "AC Repair",
      status: "pending" as const,
      date: "2023-06-20",
    },
    {
      id: "JOB-1004",
      title: "Office Wall Painting",
      location: "Building A, Floor 5",
      technician: "Sarah Johnson",
      category: "Painting",
      status: "completed" as const,
      date: "2023-06-12",
    },
    {
      id: "JOB-1005",
      title: "Door Frame Repair",
      location: "Building D, Floor 1",
      technician: "Michael Brown",
      category: "Carpentry",
      status: "pending" as const,
      date: "2023-06-22",
    },
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleViewJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsJobModalOpen(true);
  };

  const handleExportData = () => {
    // In a real implementation, this would export data to CSV or similar
    console.log("Exporting data...");
  };

  const handleCreateJob = () => {
    setShowCreateJobForm(true);
    setActiveTab("create");
  };

  const handleJobSubmit = (data: any) => {
    console.log("New job created:", data);
    setShowCreateJobForm(false);
    setActiveTab("overview");
    // In a real implementation, this would add the job to the database
  };

  const handleCloseJobModal = () => {
    setIsJobModalOpen(false);
    setSelectedJobId(null);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-500">Welcome back, {userName}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <p className="text-sm font-medium">
                Current Role: <span className="text-blue-600">{userRole}</span>
              </p>
            </div>
            <Button onClick={handleCreateJob}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Job
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
            <TabsTrigger value="create">Create Job</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Summary Section */}
            <MetricsSummary
              totalJobs={metricsData.totalJobs}
              completedJobs={metricsData.completedJobs}
              pendingJobs={metricsData.pendingJobs}
              technicians={metricsData.technicians}
              serviceCategories={metricsData.serviceCategories}
            />

            {/* Service Category Tabs */}
            <ServiceCategoryTabs
              categories={categoryData}
              onCategoryChange={handleCategoryChange}
            />

            {/* Admin Job List */}
            <AdminJobList
              jobs={jobsData}
              onViewJob={handleViewJob}
              onExportData={handleExportData}
            />
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <CreateJobForm
              onSubmit={handleJobSubmit}
              technicians={[
                { id: "tech1", name: "John Smith" },
                { id: "tech2", name: "Maria Rodriguez" },
                { id: "tech3", name: "David Chen" },
                { id: "tech4", name: "Sarah Johnson" },
                { id: "tech5", name: "Michael Brown" },
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Job Detail Modal */}
      {isJobModalOpen && selectedJobId && (
        <JobDetailModal
          jobId={selectedJobId}
          isOpen={isJobModalOpen}
          onClose={handleCloseJobModal}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
