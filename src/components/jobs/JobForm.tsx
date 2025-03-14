import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Camera, Upload, X, Save, Pen, Package } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  jobTitle: z.string().min(2, { message: "Job title is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  serviceCategory: z
    .string()
    .min(1, { message: "Service category is required" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  materialsUsed: z.string().optional(),
  selectedMaterials: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        quantity: z.number().min(1),
        unit: z.string(),
      }),
    )
    .optional(),
  notes: z.string().optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
});

interface JobFormProps {
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
  initialData?: z.infer<typeof formSchema>;
  isOffline?: boolean;
}

const JobForm = ({
  onSubmit = () => {},
  initialData = {
    jobTitle: "",
    location: "",
    serviceCategory: "",
    description: "",
    materialsUsed: "",
    notes: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  },
  isOffline = false,
}: JobFormProps) => {
  const [beforePhotos, setBeforePhotos] = useState<File[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("details");
  const [customerSignature, setCustomerSignature] = useState<string | null>(
    null,
  );
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [availableMaterials, setAvailableMaterials] = useState<
    Array<{ id: string; name: string; unit: string }>
  >([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [materialQuantity, setMaterialQuantity] = useState(1);
  const [selectedMaterials, setSelectedMaterials] = useState<
    Array<{ id: string; name: string; quantity: number; unit: string }>
  >([]);

  // In a real app, this would fetch from the backend
  useEffect(() => {
    // Mock data for available materials
    setAvailableMaterials([
      { id: "item1", name: "Electrical Outlet", unit: "pc" },
      { id: "item2", name: "Electrical Tape", unit: "roll" },
      { id: "item3", name: "Wire Connectors", unit: "pack" },
      { id: "item4", name: "Pipe Wrench", unit: "pc" },
      { id: "item5", name: "PVC Pipe (1-inch)", unit: "ft" },
      { id: "item6", name: "AC Filter", unit: "pc" },
      { id: "item7", name: "Interior Paint (White)", unit: "gallon" },
      { id: "item8", name: "Wood Screws", unit: "box" },
    ]);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // In a real implementation, this would handle the form submission
    // including uploading the photos to a server
    console.log("Form data:", data);
    console.log("Before photos:", beforePhotos);
    console.log("After photos:", afterPhotos);
    console.log("Customer signature:", customerSignature);
    console.log("Selected materials:", selectedMaterials);
    onSubmit({ ...data, customerSignature, selectedMaterials });
  };

  const handleAddMaterial = () => {
    if (!selectedMaterialId) return;

    const material = availableMaterials.find(
      (m) => m.id === selectedMaterialId,
    );
    if (!material) return;

    const newMaterial = {
      id: material.id,
      name: material.name,
      quantity: materialQuantity,
      unit: material.unit,
    };

    setSelectedMaterials([...selectedMaterials, newMaterial]);
    setSelectedMaterialId("");
    setMaterialQuantity(1);
  };

  const handleRemoveMaterial = (id: string) => {
    setSelectedMaterials(selectedMaterials.filter((m) => m.id !== id));
  };

  // Signature pad handlers
  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();

    // Get the correct position based on event type
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing) return;

    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get the correct position based on event type
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault(); // Prevent scrolling when drawing
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      setCustomerSignature(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCustomerSignature(null);
  };

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "after",
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      if (type === "before") {
        setBeforePhotos([...beforePhotos, ...filesArray]);
      } else {
        setAfterPhotos([...afterPhotos, ...filesArray]);
      }
    }
  };

  const removePhoto = (index: number, type: "before" | "after") => {
    if (type === "before") {
      setBeforePhotos(beforePhotos.filter((_, i) => i !== index));
    } else {
      setAfterPhotos(afterPhotos.filter((_, i) => i !== index));
    }
  };

  const saveOffline = () => {
    // In a real implementation, this would save the form data locally
    // for later submission when online
    alert("Job saved offline. Will sync when connection is restored.");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Job Documentation</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="details">Job Details</TabsTrigger>
          <TabsTrigger value="before">Before Photos</TabsTrigger>
          <TabsTrigger value="after">After Photos</TabsTrigger>
          <TabsTrigger value="customer">Customer Sign-off</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="serviceCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="ac_repair">AC Repair</SelectItem>
                        <SelectItem value="painting">Painting</SelectItem>
                        <SelectItem value="carpentry">Carpentry</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the job in detail"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="materialsUsed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Materials Used</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List any additional materials not in the dropdown"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include quantities and specifications where applicable.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Select Materials from Inventory
                  </h3>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Select
                        value={selectedMaterialId}
                        onValueChange={setSelectedMaterialId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableMaterials.map((material) => (
                            <SelectItem key={material.id} value={material.id}>
                              {material.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-24">
                      <Input
                        type="number"
                        min="1"
                        value={materialQuantity}
                        onChange={(e) =>
                          setMaterialQuantity(parseInt(e.target.value) || 1)
                        }
                        placeholder="Qty"
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={handleAddMaterial}
                      disabled={!selectedMaterialId}
                    >
                      Add
                    </Button>
                  </div>

                  {selectedMaterials.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">
                        Selected Materials:
                      </h4>
                      <div className="space-y-2">
                        {selectedMaterials.map((material) => (
                          <div
                            key={material.id}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded"
                          >
                            <div>
                              <span className="font-medium">
                                {material.name}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                {material.quantity} {material.unit}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMaterial(material.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional notes or observations"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                {isOffline && (
                  <Button type="button" variant="outline" onClick={saveOffline}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Offline
                  </Button>
                )}
                <Button type="submit">Complete Job Card</Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="before" className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="mb-4">
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold">Before Photos</h3>
              <p className="text-xs text-gray-500">
                Upload photos of the job site before work begins
              </p>
            </div>

            <label className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90">
              <Upload className="mr-2 h-4 w-4" />
              Upload Photos
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoUpload(e, "before")}
              />
            </label>
          </div>

          {beforePhotos.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">Uploaded Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {beforePhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Before photo ${index + 1}`}
                      className="h-32 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index, "before")}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setActiveTab("details")}>
              Back to Details
            </Button>
            <Button onClick={() => setActiveTab("after")}>
              Next: After Photos
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="after" className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="mb-4">
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold">After Photos</h3>
              <p className="text-xs text-gray-500">
                Upload photos of the completed job
              </p>
            </div>

            <label className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90">
              <Upload className="mr-2 h-4 w-4" />
              Upload Photos
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoUpload(e, "after")}
              />
            </label>
          </div>

          {afterPhotos.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">Uploaded Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {afterPhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`After photo ${index + 1}`}
                      className="h-32 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index, "after")}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setActiveTab("before")}>
              Back to Before Photos
            </Button>
            <Button onClick={() => setActiveTab("customer")}>
              Next: Customer Sign-off
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="customer" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">Customer Signature</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">
                  Please sign below to confirm job completion
                </p>
                <Button variant="outline" size="sm" onClick={clearSignature}>
                  Clear
                </Button>
              </div>
              <div className="bg-white border border-gray-200 rounded-md">
                <canvas
                  ref={signatureCanvasRef}
                  width={600}
                  height={200}
                  className="w-full touch-none cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={endDrawing}
                  onMouseLeave={endDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={endDrawing}
                />
              </div>
              <div className="flex items-center mt-2">
                <Pen className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-xs text-gray-500">
                  Sign using mouse or touch
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setActiveTab("after")}>
              Back to After Photos
            </Button>
            <Button onClick={() => form.handleSubmit(handleSubmit)()}>
              Submit Job
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobForm;
