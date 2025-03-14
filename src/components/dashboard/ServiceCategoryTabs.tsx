import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Wrench, Droplet, Wind, PaintBucket, Hammer } from "lucide-react";

interface ServiceCategoryTabsProps {
  onCategoryChange?: (category: string) => void;
  categories?: {
    id: string;
    name: string;
    count: number;
    icon: React.ReactNode;
  }[];
}

const ServiceCategoryTabs = ({
  onCategoryChange = () => {},
  categories = [
    {
      id: "electrical",
      name: "Electrical",
      count: 12,
      icon: <Wrench className="h-4 w-4 mr-2" />,
    },
    {
      id: "plumbing",
      name: "Plumbing",
      count: 8,
      icon: <Droplet className="h-4 w-4 mr-2" />,
    },
    {
      id: "ac-repair",
      name: "AC Repair",
      count: 5,
      icon: <Wind className="h-4 w-4 mr-2" />,
    },
    {
      id: "painting",
      name: "Painting",
      count: 7,
      icon: <PaintBucket className="h-4 w-4 mr-2" />,
    },
    {
      id: "carpentry",
      name: "Carpentry",
      count: 10,
      icon: <Hammer className="h-4 w-4 mr-2" />,
    },
  ],
}: ServiceCategoryTabsProps) => {
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <Tabs
        defaultValue={categories[0]?.id}
        onValueChange={onCategoryChange}
        className="w-full"
      >
        <TabsList className="w-full flex justify-between bg-gray-100 p-1 rounded-md">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center justify-center space-x-1 py-2 px-4 flex-1"
            >
              <div className="flex items-center">
                {category.icon}
                <span>{category.name}</span>
              </div>
              <Badge
                variant="secondary"
                className="ml-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-4">
            <div className="p-2 text-center text-gray-500">
              <p>
                Showing {category.name} jobs ({category.count} total)
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ServiceCategoryTabs;
