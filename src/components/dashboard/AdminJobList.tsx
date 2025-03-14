import React, { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Download,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";

interface Job {
  id: string;
  title: string;
  location: string;
  technician: string;
  category: string;
  status: "pending" | "in-progress" | "completed";
  date: string;
}

interface AdminJobListProps {
  jobs?: Job[];
  onViewJob?: (jobId: string) => void;
  onExportData?: () => void;
}

const AdminJobList = ({
  jobs = [
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
  ],
  onViewJob = () => {},
  onExportData = () => {},
}: AdminJobListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [technicianFilter, setTechnicianFilter] = useState<string>("all");

  // Filter jobs based on search query and filters
  const filteredJobs = jobs.filter((job) => {
    // Search filter
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;

    // Category filter
    const matchesCategory =
      categoryFilter === "all" || job.category === categoryFilter;

    // Technician filter
    const matchesTechnician =
      technicianFilter === "all" || job.technician === technicianFilter;

    return (
      matchesSearch && matchesStatus && matchesCategory && matchesTechnician
    );
  });

  // Get unique technicians for filter
  const technicians = [...new Set(jobs.map((job) => job.technician))];

  // Get unique categories for filter
  const categories = [...new Set(jobs.map((job) => job.category))];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-2xl font-bold">Job Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs by ID, title, or location..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by technician" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Technicians</SelectItem>
              {technicians.map((technician) => (
                <SelectItem key={technician} value={technician}>
                  {technician}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="hidden lg:block">
            <DatePickerWithRange className="w-[300px]" />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.id}</TableCell>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      {job.technician}
                    </div>
                  </TableCell>
                  <TableCell>{job.category}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(job.status)}>
                      {job.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.date}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewJob(job.id)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Reassign</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-muted-foreground"
                >
                  No jobs found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminJobList;
