

import React from "react";
import { Search, Filter, Plus, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skill } from "../../../types/skill";
import SkillCard from "./SkillCard";
import SkeletonSkillCard from "./SkillSkeleton";

interface SkillListProps {
  skills: Skill[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  categories: string[];
  isFetching: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: number | null;
  onEdit: (skill: Skill) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
  onAdd: () => void;
}

const SkillList: React.FC<SkillListProps> = ({
  skills,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  categories,
  isFetching,
  error,
  isSaving,
  isDeleting,
  onEdit,
  onDelete,
  onRefresh,
  onAdd,
}) => {
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || skill.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Skill Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Create, edit, and manage your skills efficiently
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isFetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          <Button
            onClick={onAdd}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card className="shadow-sm border border-gray-200 dark:border-gray-800">
        <CardContent className="p-4 md:p-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={isFetching}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 md:w-auto w-full">
            <Filter className="text-gray-400 h-5 w-5" />
            <Select
              value={filterCategory}
              onValueChange={setFilterCategory}
              disabled={isFetching}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isFetching ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonSkillCard key={i} />)
        ) : filteredSkills.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Search className="mx-auto text-gray-400 mb-4 h-12 w-12" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No skills found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={onEdit}
              onDelete={onDelete}
              isSaving={isSaving}
              isDeleting={isDeleting}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SkillList;
