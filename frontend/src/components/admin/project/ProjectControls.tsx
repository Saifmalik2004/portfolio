import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
import { Search, Plus } from "lucide-react";
import { ProjectType } from "../../../types/project";

type Technology = { id: number; name: string };

type ProjectControlsProps = {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  filterType: ProjectType | "all";
  setFilterType: (t: ProjectType | "all") => void;
  filterTech: number | "all";
  setFilterTech: (n: number | "all") => void;
  showOnlyLive: boolean;
  setShowOnlyLive: (v: boolean) => void;
  types: Array<ProjectType | "all">;
  technologies: Technology[];
  onAdd: () => void;
  isSaving: boolean;
};

const ProjectControls: React.FC<ProjectControlsProps> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterTech,
  setFilterTech,
  showOnlyLive,
  setShowOnlyLive,
  types,
  technologies,
  onAdd,
  isSaving,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-8 px-0 sm:px-4">
      {/* 🔹 Top Controls */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10 h-10 bg-white/80 border-white/20 shadow-sm rounded-lg focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search projects"
          />
        </div>

        {/* Filter by Project Type */}
        <div className="w-full md:w-48">
          <Label className="text-sm font-medium text-gray-700 sr-only">Project Type</Label>
          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value as ProjectType | "all")}
          >
            <SelectTrigger className="h-10 bg-white/80 border-white/20 shadow-sm rounded-lg">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-white/90 backdrop-blur-sm">
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "All Types" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Show Only Live Toggle */}
        <Toggle
          pressed={showOnlyLive}
          onPressedChange={setShowOnlyLive}
          className={`h-10 px-4 rounded-lg border transition-all ${
            showOnlyLive
              ? "bg-green-600 text-white border-green-600"
              : "bg-white/80 text-gray-800 border-gray-200 hover:bg-gray-100"
          }`}
          aria-label={showOnlyLive ? "Showing only live projects" : "Show all projects"}
        >
          {showOnlyLive ? "Only Live" : "All Projects"}
        </Toggle>

        {/* Add Project Button */}
        <Button
          onClick={onAdd}
          disabled={isSaving}
          className="h-10 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* 🔹 Pills-based Technology Filter (Horizontal Scroll) */}
      <div
        className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent py-2 px-1 rounded-md"
        style={{
          scrollbarWidth: "thin",
          scrollBehavior: "smooth",
        }}
      >
        <button
          onClick={() => setFilterTech("all")}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
            filterTech === "all"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white/80 border-gray-200 text-gray-800 hover:bg-gray-100"
          }`}
        >
          All Technologies
        </button>

        {technologies.map((tech) => (
          <button
            key={tech.id}
            onClick={() => setFilterTech(tech.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
              filterTech === tech.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white/80 border-gray-200 text-gray-800 hover:bg-gray-100"
            }`}
          >
            {tech.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectControls;
