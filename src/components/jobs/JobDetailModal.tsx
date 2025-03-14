import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Badge } from "../ui/badge";
import {
  Clock,
  MapPin,
  User,
  Wrench,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";

interface JobDetailModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onApprove?: () => void;
  onRequestChanges?: () => void;
  job?: {
    id: string;
    title: string;
    description: string;
    status:
      | "pending"
      | "in-progress"
      | "completed"
      | "approved"
      | "changes-requested";
    category:
      | "electrical"
      | "plumbing"
      | "ac-repair"
      | "painting"
      | "carpentry";
    location: string;
    technician: {
      id: string;
      name: string;
      avatar: string;
    };
    createdAt: string;
    completedAt?: string;
    beforePhotos: string[];
    afterPhotos: string[];
    materials: {
      name: string;
      quantity: number;
      unit: string;
    }[];
    notes?: string;
    customerSignature?: string;
    customerName?: string;
  };
}

const JobDetailModal = ({
  isOpen = true,
  onClose = () => {},
  onApprove = () => {},
  onRequestChanges = () => {},
  job = {
    id: "JOB-1234",
    title: "Electrical Outlet Repair",
    description: "Replace damaged electrical outlet in conference room",
    status: "completed",
    category: "electrical",
    location: "Building A, Floor 2, Room 201",
    technician: {
      id: "TECH-001",
      name: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    createdAt: "2023-06-15T09:30:00Z",
    completedAt: "2023-06-15T11:45:00Z",
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
  },
}: JobDetailModalProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "completed":
        return <Badge>Completed</Badge>;
      case "approved":
        return (
          <Badge
            variant="secondary"
            className="bg-green-500 hover:bg-green-600"
          >
            Approved
          </Badge>
        );
      case "changes-requested":
        return <Badge variant="destructive">Changes Requested</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      electrical: "bg-yellow-500 hover:bg-yellow-600",
      plumbing: "bg-blue-500 hover:bg-blue-600",
      "ac-repair": "bg-cyan-500 hover:bg-cyan-600",
      painting: "bg-purple-500 hover:bg-purple-600",
      carpentry: "bg-amber-500 hover:bg-amber-600",
    };

    const categoryLabels: Record<string, string> = {
      electrical: "Electrical",
      plumbing: "Plumbing",
      "ac-repair": "AC Repair",
      painting: "Painting",
      carpentry: "Carpentry",
    };

    return (
      <Badge
        variant="secondary"
        className={categoryColors[category] || "bg-gray-500 hover:bg-gray-600"}
      >
        {categoryLabels[category] || "Unknown"}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {job.title}
            </DialogTitle>
            <div className="flex space-x-2">
              {getStatusBadge(job.status)}
              {getCategoryBadge(job.category)}
            </div>
          </div>
          <DialogDescription className="text-base mt-2">
            {job.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{job.location}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-gray-500" />
              <div className="flex items-center space-x-2">
                <img
                  src={job.technician.avatar}
                  alt={job.technician.name}
                  className="h-6 w-6 rounded-full"
                />
                <span className="text-gray-700">{job.technician.name}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">
                Created: {formatDate(job.createdAt)}
              </span>
            </div>

            {job.completedAt && (
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">
                  Completed: {formatDate(job.completedAt)}
                </span>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium flex items-center mb-2">
              <Wrench className="h-4 w-4 mr-2" />
              Materials Used
            </h3>
            <ul className="space-y-2">
              {job.materials.map((material, index) => (
                <li key={index} className="text-sm flex justify-between">
                  <span>{material.name}</span>
                  <span className="text-gray-500">
                    {material.quantity} {material.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Tabs defaultValue="before" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="before">Before Photos</TabsTrigger>
            <TabsTrigger value="after">After Photos</TabsTrigger>
          </TabsList>
          <TabsContent value="before" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.beforePhotos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-md overflow-hidden"
                >
                  <img
                    src={photo}
                    alt={`Before photo ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="after" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.afterPhotos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-md overflow-hidden"
                >
                  <img
                    src={photo}
                    alt={`After photo ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {job.notes && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Notes</h3>
            <p className="text-sm text-gray-700">{job.notes}</p>
          </div>
        )}

        {job.customerSignature && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Customer Approval</h3>
            {job.customerName && (
              <p className="text-sm text-gray-700 mb-2">
                Signed by: {job.customerName}
              </p>
            )}
            <div className="border border-gray-200 bg-white p-2 rounded-md">
              <img
                src={job.customerSignature}
                alt="Customer signature"
                className="max-h-32 mx-auto"
              />
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">Job ID: {job.id}</div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="destructive" onClick={onRequestChanges}>
              <XCircle className="h-4 w-4 mr-2" />
              Request Changes
            </Button>
            <Button onClick={onApprove}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailModal;
