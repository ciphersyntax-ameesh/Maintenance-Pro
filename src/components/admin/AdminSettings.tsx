import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TechnicianManagement from "./TechnicianManagement";
import ServiceCategoryManagement from "./ServiceCategoryManagement";
import JobItemsManagement from "./JobItemsManagement";

const AdminSettings = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">
          Manage users, categories, and job items
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="categories">Service Categories</TabsTrigger>
          <TabsTrigger value="items">Job Items</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <TechnicianManagement />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <ServiceCategoryManagement />
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          <JobItemsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
