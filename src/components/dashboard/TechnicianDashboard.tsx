import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  PlusCircle,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import JobList from "./JobList";
import JobForm from "../jobs/JobForm";

interface TechnicianDashboardProps {
  userName?: string;
  jobCount?: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
}

const TechnicianDashboard = ({
  userName = "John Technician",
  jobCount = {
    total: 12,
    pending: 5,
    inProgress: 3,
    completed: 4,
  },
}: TechnicianDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [isOffline, setIsOffline] = useState(false); // Simulated offline state

  // Simulate checking network status
  React.useEffect(() => {
    const checkNetworkStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener("online", checkNetworkStatus);
    window.addEventListener("offline", checkNetworkStatus);
    checkNetworkStatus();

    return () => {
      window.removeEventListener("online", checkNetworkStatus);
      window.removeEventListener("offline", checkNetworkStatus);
    };
  }, []);

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setShowJobForm(true);
    setActiveTab("documentation");
  };

  const handleNewJob = () => {
    setSelectedJobId(null);
    setShowJobForm(true);
    setActiveTab("documentation");
  };

  const handleJobFormSubmit = (data: any) => {
    // In a real implementation, this would submit the job data to a server
    console.log("Job submitted:", data);
    setShowJobForm(false);
    setActiveTab("overview");
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {isOffline && (
        <div className="bg-amber-100 text-amber-800 px-4 py-2 flex items-center justify-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          You are currently offline. Changes will be saved locally and synced
          when you're back online.
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
            <p className="text-gray-600">
              Manage your assigned maintenance jobs
            </p>
          </div>
          <Button onClick={handleNewJob} className="mt-4 md:mt-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Job Documentation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Jobs
                  </p>
                  <p className="text-2xl font-bold">{jobCount.total}</p>
                </div>
                <ClipboardList className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-bold">{jobCount.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold">{jobCount.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-bold">{jobCount.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview">Job Overview</TabsTrigger>
            <TabsTrigger value="documentation">Job Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <JobList onSelectJob={handleSelectJob} />
          </TabsContent>

          <TabsContent value="documentation" className="space-y-6">
            {showJobForm ? (
              <JobForm
                onSubmit={handleJobFormSubmit}
                isOffline={isOffline}
                // In a real implementation, you would fetch the job data based on selectedJobId
                // and pass it as initialData if editing an existing job
              />
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No Job Selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a job from the overview tab or create a new job
                  documentation
                </p>
                <Button onClick={handleNewJob} className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Job Documentation
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
