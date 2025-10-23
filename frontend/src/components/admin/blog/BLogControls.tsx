"use client";

import React from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type BlogControlsProps = {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterCategory: string;
  setFilterCategory: (val: string) => void;
  categories: string[];
  onAdd: () => void;
  isSaving: boolean;
};

const BlogControls: React.FC<BlogControlsProps> = ({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  categories,
  onAdd,
  isSaving,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
        <div className="relative w-full sm:w-64">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={filterCategory}
          onValueChange={(value) => setFilterCategory(value)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Add Button */}
      <Button
        onClick={onAdd}
        disabled={isSaving}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
      >
        <Plus size={18} />
        <span>{isSaving ? "Saving..." : "Add New Blog"}</span>
      </Button>
    </div>
  );
};

export default BlogControls;
