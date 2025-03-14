import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, UserPlus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  username: z.string().min(2, { message: "Username is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  specialization: z.string().optional(),
  status: z.string().default("active"),
});

interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  username: string;
  specialization?: string;
  status: "active" | "inactive";
  avatar?: string;
}

const TechnicianManagement = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([
    {
      id: "tech1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
      role: "Technician",
      username: "johnsmith",
      specialization: "Electrical",
      status: "active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    {
      id: "tech2",
      name: "Maria Rodriguez",
      email: "maria.rodriguez@example.com",
      phone: "(555) 987-6543",
      role: "Technician",
      username: "mariar",
      specialization: "Plumbing",
      status: "active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
    },
    {
      id: "tech3",
      name: "David Chen",
      email: "david.chen@example.com",
      phone: "(555) 456-7890",
      role: "Technician",
      username: "davidc",
      specialization: "AC Repair",
      status: "inactive",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    },
    {
      id: "admin1",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "(555) 789-0123",
      role: "Administrator",
      username: "sarahj",
      status: "active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    {
      id: "back1",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "(555) 234-5678",
      role: "BackOffice",
      username: "michaelb",
      status: "active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    },
  ]);

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] =
    useState<Technician | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "Technician",
      username: "",
      password: "",
      specialization: "",
      status: "active",
    },
  });

  const handleAddUser = (data: z.infer<typeof formSchema>) => {
    if (selectedTechnician) {
      // Edit existing technician
      setTechnicians(
        technicians.map((tech) =>
          tech.id === selectedTechnician.id
            ? {
                ...tech,
                name: data.name,
                email: data.email,
                phone: data.phone,
                role: data.role,
                username: data.username,
                specialization: data.specialization,
                status: data.status as "active" | "inactive",
              }
            : tech,
        ),
      );
    } else {
      // Add new technician
      const newTechnician: Technician = {
        id: `tech${technicians.length + 1}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        username: data.username,
        specialization: data.specialization,
        status: data.status as "active" | "inactive",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      };

      setTechnicians([...technicians, newTechnician]);
    }

    setIsAddUserOpen(false);
    form.reset();
    setSelectedTechnician(null);
  };

  const handleEditTechnician = (technician: Technician) => {
    setSelectedTechnician(technician);
    form.reset({
      name: technician.name,
      email: technician.email,
      phone: technician.phone,
      role: technician.role,
      username: technician.username,
      password: "", // Don't populate password for security reasons
      specialization: technician.specialization || "",
      status: technician.status,
    });
    setIsAddUserOpen(true);
  };

  const handleDeleteTechnician = (technician: Technician) => {
    setSelectedTechnician(technician);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTechnician) {
      setTechnicians(
        technicians.filter((tech) => tech.id !== selectedTechnician.id),
      );
      setIsDeleteDialogOpen(false);
      setSelectedTechnician(null);
    }
  };

  // Filter technicians based on search query and role filter
  const filteredTechnicians = technicians.filter((tech) => {
    const matchesSearch =
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || tech.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            Manage technicians and system users
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedTechnician(null);
            form.reset();
            setIsAddUserOpen(true);
          }}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email, or username..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Administrator">Administrator</SelectItem>
            <SelectItem value="BackOffice">Back Office</SelectItem>
            <SelectItem value="Technician">Technician</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">
                  Specialization
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTechnicians.length > 0 ? (
                filteredTechnicians.map((technician) => (
                  <TableRow key={technician.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={technician.avatar}
                            alt={technician.name}
                          />
                          <AvatarFallback>
                            {technician.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{technician.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {technician.username}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          technician.role === "Administrator"
                            ? "bg-blue-100 text-blue-800"
                            : technician.role === "BackOffice"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {technician.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {technician.email}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {technician.phone}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {technician.specialization || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          technician.status === "active"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          technician.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {technician.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTechnician(technician)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTechnician(technician)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No users found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedTechnician ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogDescription>
              {selectedTechnician
                ? "Update user information and permissions."
                : "Create a new user account with appropriate role and permissions."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddUser)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Administrator">
                            Administrator
                          </SelectItem>
                          <SelectItem value="BackOffice">
                            Back Office
                          </SelectItem>
                          <SelectItem value="Technician">Technician</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john.smith@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johnsmith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {selectedTechnician ? "New Password" : "Password"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={
                            selectedTechnician
                              ? "Leave blank to keep current"
                              : "Enter password"
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {selectedTechnician
                          ? "Leave blank to keep current password"
                          : "Minimum 6 characters"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          <SelectItem value="Electrical">Electrical</SelectItem>
                          <SelectItem value="Plumbing">Plumbing</SelectItem>
                          <SelectItem value="AC Repair">AC Repair</SelectItem>
                          <SelectItem value="Painting">Painting</SelectItem>
                          <SelectItem value="Carpentry">Carpentry</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Only applicable for technicians
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddUserOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedTechnician ? "Update User" : "Add User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedTechnician?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechnicianManagement;
