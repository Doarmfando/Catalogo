"use client";

import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { CarCategory } from "@/shared/types/car";
import { useMemo } from "react";

interface TopTabsProps {
  categories: any[];
  selectedCategory: CarCategory;
  onCategoryChange: (category: CarCategory) => void;
}

export function TopTabs({ categories: dbCategories, selectedCategory, onCategoryChange }: TopTabsProps) {
  // Build categories array: "Todos" + active categories (with ECOLÓGICOS)
  const categories = useMemo(() => {
    const activeCategories = dbCategories.map((cat) => cat.name.toUpperCase() as CarCategory);
    // Use Set to avoid duplicates and ensure "Todos" is first and "ECOLÓGICOS" is second
    const categoriesSet = new Set<CarCategory>(["Todos" as CarCategory, "ECOLÓGICOS" as CarCategory, ...activeCategories]);
    return Array.from(categoriesSet);
  }, [dbCategories]);
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
