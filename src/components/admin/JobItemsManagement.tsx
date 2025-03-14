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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Package } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Item name is required" }),
  description: z.string().optional(),
  category: z.string().min(1, { message: "Category is required" }),
  unit: z.string().min(1, { message: "Unit is required" }),
  inStock: z.coerce.number().min(0, { message: "Stock cannot be negative" }),
});

interface JobItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  unit: string;
  inStock: number;
  usageCount: number;
}

const JobItemsManagement = () => {
  const [items, setItems] = useState<JobItem[]>([
    {
      id: "item1",
      name: "Electrical Outlet",
      description: "Standard 120V electrical outlet",
      category: "Electrical",
      unit: "pc",
      inStock: 45,
      usageCount: 28,
    },
    {
      id: "item2",
      name: "Electrical Tape",
      description: "Insulating tape for electrical connections",
      category: "Electrical",
      unit: "roll",
      inStock: 32,
      usageCount: 15,
    },
    {
      id: "item3",
      name: "Wire Connectors",
      description: "Wire nuts for connecting electrical wires",
      category: "Electrical",
      unit: "pack",
      inStock: 50,
      usageCount: 22,
    },
    {
      id: "item4",
      name: "Pipe Wrench",
      description: "Adjustable wrench for plumbing pipes",
      category: "Plumbing",
      unit: "pc",
      inStock: 12,
      usageCount: 8,
    },
    {
      id: "item5",
      name: "PVC Pipe (1-inch)",
      description: "1-inch diameter PVC pipe",
      category: "Plumbing",
      unit: "ft",
      inStock: 200,
      usageCount: 45,
    },
    {
      id: "item6",
      name: "AC Filter",
      description: "Replacement air filter for AC units",
      category: "AC Repair",
      unit: "pc",
      inStock: 30,
      usageCount: 18,
    },
    {
      id: "item7",
      name: "Interior Paint (White)",
      description: "Standard white interior paint",
      category: "Painting",
      unit: "gallon",
      inStock: 25,
      usageCount: 12,
    },
    {
      id: "item8",
      name: "Wood Screws",
      description: "Assorted wood screws for carpentry",
      category: "Carpentry",
      unit: "box",
      inStock: 40,
      usageCount: 20,
    },
  ]);

  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<JobItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      unit: "",
      inStock: 0,
    },
  });

  const handleAddItem = (data: z.infer<typeof formSchema>) => {
    if (selectedItem) {
      // Edit existing item
      setItems(
        items.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                name: data.name,
                description: data.description,
                category: data.category,
                unit: data.unit,
                inStock: data.inStock,
              }
            : item,
        ),
      );
    } else {
      // Add new item
      const newItem: JobItem = {
        id: `item${items.length + 1}`,
        name: data.name,
        description: data.description,
        category: data.category,
        unit: data.unit,
        inStock: data.inStock,
        usageCount: 0,
      };

      setItems([...items, newItem]);
    }

    setIsAddItemOpen(false);
    form.reset();
    setSelectedItem(null);
  };

  const handleEditItem = (item: JobItem) => {
    setSelectedItem(item);
    form.reset({
      name: item.name,
      description: item.description || "",
      category: item.category,
      unit: item.unit,
      inStock: item.inStock,
    });
    setIsAddItemOpen(true);
  };

  const handleDeleteItem = (item: JobItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      setItems(items.filter((item) => item.id !== selectedItem.id));
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  // Get unique categories for filter
  const categories = [...new Set(items.map((item) => item.category))];

  // Filter items based on search query and category filter
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);

    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Job Items & Materials</h2>
          <p className="text-muted-foreground">
            Manage materials and items used in maintenance jobs
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedItem(null);
            form.reset();
            setIsAddItemOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

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
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-center">In Stock</TableHead>
                <TableHead className="text-center">Usage Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={item.inStock > 10 ? "default" : "destructive"}
                        className={
                          item.inStock > 10 ? "bg-green-100 text-green-800" : ""
                        }
                      >
                        {item.inStock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.usageCount}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item)}
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
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No items found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Item Dialog */}
      <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? "Edit Item" : "Add New Item"}
            </DialogTitle>
            <DialogDescription>
              {selectedItem
                ? "Update item information and inventory."
                : "Add a new material or item for job documentation."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddItem)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Electrical Outlet" {...field} />
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
                        placeholder="Standard 120V electrical outlet"
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pc">Piece (pc)</SelectItem>
                          <SelectItem value="box">Box</SelectItem>
                          <SelectItem value="roll">Roll</SelectItem>
                          <SelectItem value="pack">Pack</SelectItem>
                          <SelectItem value="ft">Feet (ft)</SelectItem>
                          <SelectItem value="m">Meter (m)</SelectItem>
                          <SelectItem value="gallon">Gallon</SelectItem>
                          <SelectItem value="liter">Liter</SelectItem>
                          <SelectItem value="kg">Kilogram (kg)</SelectItem>
                          <SelectItem value="lb">Pound (lb)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="inStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>In Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Current inventory quantity
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddItemOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedItem ? "Update Item" : "Add Item"}
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
              Are you sure you want to delete {selectedItem?.name}? This action
              cannot be undone.
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

export default JobItemsManagement;
