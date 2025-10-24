import React from "react";
import { Plus, Search, RefreshCw } from "lucide-react";
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
  onRefresh: () => void;
  isSaving: boolean;
  isFetching: boolean;
};

const BlogControls: React.FC<BlogControlsProps> = ({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  categories,
  onAdd,
  onRefresh,
  isSaving,
  isFetching,
}) => {
  return (
    <div className="mb-10">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Blog Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Create, edit, and manage your blogs efficiently
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Search + Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-lg"
              disabled={isFetching}
            />
          </div>

          {/* Category Filter */}
          <Select
            value={filterCategory}
            onValueChange={(value) => setFilterCategory(value)}
            disabled={isFetching}
          >
            <SelectTrigger className="h-10 w-full sm:w-48 rounded-lg">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="bg-white/90 backdrop-blur-sm">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={onRefresh}
            disabled={isFetching}
            variant="outline"
            className="flex items-center gap-2 h-10 px-4 rounded-lg"
          >
            <RefreshCw size={18} />
            Refresh
          </Button>

          <Button
            onClick={onAdd}
            disabled={isSaving}
            className="h-10 px-6 flex items-center gap-2 "
          >
            <Plus className="h-4 w-4" />
            {isSaving ? "Saving..." : "Add New Blog"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogControls;
