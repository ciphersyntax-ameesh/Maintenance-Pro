import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PlusCircle, ClipboardList, Calendar, Users } from "lucide-react";
import AdminJobList from "./AdminJobList";
import CreateJobForm from "../jobs/CreateJobForm";
import ServiceCategoryTabs from "./ServiceCategoryTabs";

interface BackOfficeDashboardProps {
  userName?: string;
  userRole?: string;
}

const BackOfficeDashboard = ({
  userName = "Back Office User",
  userRole = "BackOffice",
}: BackOfficeDashboardProps) => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [showCreateJobForm, setShowCreateJobForm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Mock data for technicians
  const technicians = [
    { id: "tech1", name: "John Smith" },
    { id: "tech2", name: "Maria Rodriguez" },
    { id: "tech3", name: "David Chen" },
    { id: "tech4", name: "Sarah Johnson" },
    { id: "tech5", name: "Michael Brown" },
  ];

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

  const handleCreateJob = () => {
    setShowCreateJobForm(true);
    setActiveTab("create");
  };

  const handleJobSubmit = (data: any) => {
    console.log("New job created:", data);
    setShowCreateJobForm(false);
    setActiveTab("jobs");
    // In a real implementation, this would add the job to the database
  };

  const handleViewJob = (jobId: string) => {
    setSelectedJobId(jobId);
    // In a real implementation, this would open a job detail modal
    console.log("Viewing job:", jobId);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Back Office Dashboard
            </h1>
            <p className="text-gray-500">Welcome back, {userName}</p>
          </div>
          <Button onClick={handleCreateJob} className="mt-4 md:mt-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Job
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Jobs
                  </p>
                  <p className="text-2xl font-bold">124</p>
                </div>
                <ClipboardList className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Scheduled Today
                  </p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active Technicians
                  </p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="jobs">Manage Jobs</TabsTrigger>
            <TabsTrigger value="create">Create Job</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <ServiceCategoryTabs categories={categoryData} />

            <AdminJobList
              jobs={[
                {
                  id: "JOB-1001",
                  title: "Electrical Panel Repair",
                  location: "Building A, Floor 3",
                  technician: "John Smith",
                  category: "Electrical",
                  status: "completed",
                  date: "2023-06-15",
                },
                {
                  id: "JOB-1002",
                  title: "Plumbing Leak Fix",
                  location: "Building B, Floor 1",
                  technician: "Maria Rodriguez",
                  category: "Plumbing",
                  status: "in-progress",
                  date: "2023-06-18",
                },
                {
                  id: "JOB-1003",
                  title: "AC Unit Maintenance",
                  location: "Building C, Floor 2",
                  technician: "David Chen",
                  category: "AC Repair",
                  status: "pending",
                  date: "2023-06-20",
                },
                {
                  id: "JOB-1004",
                  title: "Office Wall Painting",
                  location: "Building A, Floor 5",
                  technician: "Sarah Johnson",
                  category: "Painting",
                  status: "completed",
                  date: "2023-06-12",
                },
                {
                  id: "JOB-1005",
                  title: "Door Frame Repair",
                  location: "Building D, Floor 1",
                  technician: "Michael Brown",
                  category: "Carpentry",
                  status: "pending",
                  date: "2023-06-22",
                },
              ]}
              onViewJob={handleViewJob}
            />
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <CreateJobForm
              onSubmit={handleJobSubmit}
              technicians={technicians}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BackOfficeDashboard;
