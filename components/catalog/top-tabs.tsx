"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarCategory } from "@/types/car";

interface TopTabsProps {
  selectedCategory: CarCategory;
  onCategoryChange: (category: CarCategory) => void;
}

const categories: CarCategory[] = [
  "Todos",
  "ECOLÓGICOS",
  "HATCHBACK",
  "SEDÁN",
  "SUV",
  "UTILITARIOS",
  "COMERCIALES",
];

export function TopTabs({ selectedCategory, onCategoryChange }: TopTabsProps) {
  return (
    <Tabs
      value={selectedCategory}
      onValueChange={(value) => onCategoryChange(value as CarCategory)}
      className="w-full"
    >
      <TabsList className="w-full justify-start bg-transparent border-0 border-b border-gray-200 rounded-none h-auto p-0 gap-8">
        {categories.map((category) => (
          <TabsTrigger
            key={category}
            value={category}
            className="bg-transparent border-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#00AAD2] rounded-none pb-3 px-0 font-medium text-base text-gray-600 data-[state=active]:text-[#002C5F] hover:text-[#002C5F] transition-colors cursor-pointer"
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
