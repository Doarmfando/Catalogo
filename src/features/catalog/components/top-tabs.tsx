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
  // Build categories array: "Todos" + active categories from DB
  const categories = useMemo(() => {
    const activeCategories = dbCategories.map((cat) => cat.name.toUpperCase() as CarCategory);
    // Use Set to avoid duplicates and ensure "Todos" is first
    const categoriesSet = new Set<CarCategory>(["Todos" as CarCategory, ...activeCategories]);
    return Array.from(categoriesSet);
  }, [dbCategories]);
  return (
    <Tabs
      value={selectedCategory}
      onValueChange={(value) => onCategoryChange(value as CarCategory)}
      className="w-full"
    >
      <div className="w-full overflow-x-auto scrollbar-hide">
        <TabsList className="inline-flex min-w-full justify-start bg-transparent border-0 border-b border-gray-200 rounded-none h-auto p-0 gap-4 sm:gap-6 lg:gap-8">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="bg-transparent border-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#00AAD2] rounded-none pb-3 px-0 font-medium text-sm sm:text-base text-gray-600 data-[state=active]:text-[#002C5F] hover:text-[#002C5F] transition-colors cursor-pointer whitespace-nowrap"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
