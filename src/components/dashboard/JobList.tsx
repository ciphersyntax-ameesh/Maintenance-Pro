import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  location: string;
  category: string;
  status: "pending" | "in-progress" | "completed";
  date: string;
  client: string;
}

interface JobListProps {
  jobs?: Job[];
  onSelectJob?: (jobId: string) => void;
}

const JobList = ({
  jobs = defaultJobs,
  onSelectJob = () => {},
}: JobListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredJobs = jobs.filter((job) => {
    // Filter by search term
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.client.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-xl font-bold">Assigned Jobs</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search jobs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onClick={() => onSelectJob(job.id)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No jobs found matching your criteria
              </div>
            )}
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            {filteredJobs.filter(
              (job) => job.date === new Date().toISOString().split("T")[0],
            ).length > 0 ? (
              filteredJobs
                .filter(
                  (job) => job.date === new Date().toISOString().split("T")[0],
                )
                .map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onClick={() => onSelectJob(job.id)}
                  />
                ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No jobs scheduled for today
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {filteredJobs.filter((job) => new Date(job.date) > new Date())
              .length > 0 ? (
              filteredJobs
                .filter((job) => new Date(job.date) > new Date())
                .map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onClick={() => onSelectJob(job.id)}
                  />
                ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No upcoming jobs
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

const JobCard = ({ job, onClick }: JobCardProps) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <div
      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-lg">{job.title}</h3>
            <Badge className={statusColors[job.status]}>
              {job.status === "in-progress"
                ? "In Progress"
                : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
          </div>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(job.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Client: {job.client}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-2 md:mt-0">
          <Button variant="ghost" size="sm" className="gap-1">
            View Details <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Default mock data
const defaultJobs: Job[] = [
  {
    id: "1",
    title: "Fix Electrical Outlet",
    location: "Building A, Floor 2, Room 203",
    category: "Electrical",
    status: "pending",
    date: "2023-06-15",
    client: "Office Solutions Inc.",
  },
  {
    id: "2",
    title: "Repair Leaking Pipe",
    location: "Building C, Floor 1, Room 105",
    category: "Plumbing",
    status: "in-progress",
    date: new Date().toISOString().split("T")[0], // Today
    client: "Riverdale Apartments",
  },
  {
    id: "3",
    title: "AC Unit Maintenance",
    location: "Building B, Floor 3, Room 312",
    category: "AC Repair",
    status: "completed",
    date: "2023-06-10",
    client: "Summit Office Park",
  },
  {
    id: "4",
    title: "Paint Conference Room",
    location: "Building A, Floor 4, Room 401",
    category: "Painting",
    status: "pending",
    date: "2023-06-20", // Future date
    client: "Tech Innovations LLC",
  },
  {
    id: "5",
    title: "Replace Broken Cabinet",
    location: "Building D, Floor 2, Room 215",
    category: "Carpentry",
    status: "pending",
    date: "2023-06-18", // Future date
    client: "Downtown Medical Center",
  },
];

export default JobList;
