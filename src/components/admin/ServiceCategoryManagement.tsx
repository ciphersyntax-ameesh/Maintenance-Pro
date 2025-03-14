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
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Settings } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Category name is required" }),
  description: z.string().min(5, { message: "Description is required" }),
  icon: z.string().optional(),
  color: z.string().optional(),
});

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  jobCount: number;
}

const ServiceCategoryManagement = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([
    {
      id: "electrical",
      name: "Electrical",
      description: "Electrical system maintenance and repairs",
      icon: "⚡",
      color: "yellow",
      jobCount: 32,
    },
    {
      id: "plumbing",
      name: "Plumbing",
      description: "Water system repairs and installations",
      icon: "🚿",
      color: "blue",
      jobCount: 28,
    },
    {
      id: "ac-repair",
      name: "AC Repair",
      description: "Air conditioning maintenance and repairs",
      icon: "❄️",
      color: "cyan",
      jobCount: 24,
    },
    {
      id: "painting",
      name: "Painting",
      description: "Interior and exterior painting services",
      icon: "🎨",
      color: "purple",
      jobCount: 22,
    },
    {
      id: "carpentry",
      name: "Carpentry",
      description: "Woodwork and structural repairs",
      icon: "🔨",
      color: "amber",
      jobCount: 18,
    },
  ]);

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      color: "",
    },
  });

  const handleAddCategory = (data: z.infer<typeof formSchema>) => {
    if (selectedCategory) {
      // Edit existing category
      setCategories(
        categories.map((cat) =>
          cat.id === selectedCategory.id
            ? {
                ...cat,
                name: data.name,
                description: data.description,
                icon: data.icon,
                color: data.color,
              }
            : cat,
        ),
      );
    } else {
      // Add new category
      const newCategory: ServiceCategory = {
        id: data.name.toLowerCase().replace(/\s+/g, "-"),
        name: data.name,
        description: data.description,
        icon: data.icon,
        color: data.color,
        jobCount: 0,
      };

      setCategories([...categories, newCategory]);
    }

    setIsAddCategoryOpen(false);
    form.reset();
    setSelectedCategory(null);
  };

  const handleEditCategory = (category: ServiceCategory) => {
    setSelectedCategory(category);
    form.reset({
      name: category.name,
      description: category.description,
      icon: category.icon || "",
      color: category.color || "",
    });
    setIsAddCategoryOpen(true);
  };

  const handleDeleteCategory = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    }
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Service Categories</h2>
          <p className="text-muted-foreground">
            Manage service categories for job assignments
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedCategory(null);
            form.reset();
            setIsAddCategoryOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Jobs</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{category.jobCount}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCategory(category)}
                          disabled={category.jobCount > 0}
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
                    colSpan={4}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No categories found matching your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? "Update service category details."
                : "Create a new service category for job assignments."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddCategory)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Electrical" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Electrical system maintenance and repairs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon (Emoji)</FormLabel>
                      <FormControl>
                        <Input placeholder="⚡" {...field} />
                      </FormControl>
                      <FormDescription>
                        Use an emoji as the category icon
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="yellow" {...field} />
                      </FormControl>
                      <FormDescription>
                        Color name (e.g., blue, green, red)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddCategoryOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedCategory ? "Update Category" : "Add Category"}
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
              Are you sure you want to delete the {selectedCategory?.name}{" "}
              category? This action cannot be undone.
              {selectedCategory?.jobCount > 0 && (
                <p className="text-red-500 mt-2">
                  This category has {selectedCategory.jobCount} associated jobs
                  and cannot be deleted.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={selectedCategory?.jobCount > 0}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceCategoryManagement;
