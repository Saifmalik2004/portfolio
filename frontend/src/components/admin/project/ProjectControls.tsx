import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
 
import { Search, Plus } from "lucide-react";
import { ProjectType } from "../../../types/project";

type Technology = { id: number; name: string };

type ProjectControlsProps = {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  filterType: ProjectType | "all";
  setFilterType: (t: ProjectType | "all") => void;
  filterTech: string | "all";
  setFilterTech: (n: string | "all") => void;
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
    <div className="mb-10">
      {/* Header + Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Filter and manage your projects efficiently
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 h-10"
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter by Project Type */}
          <div className="w-full sm:w-48">
            <Select value={filterType} onValueChange={(v) => setFilterType(v as ProjectType | "all")}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Live Toggle */}
          <Toggle
            pressed={showOnlyLive}
            onPressedChange={setShowOnlyLive}
            className={`h-10 px-4 rounded-lg border transition-all ${
              showOnlyLive
                ? "bg-green-600 text-white border-green-600"
                : "bg-white/80 text-gray-800 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {showOnlyLive ? "Only Live" : "All Projects"}
          </Toggle>

          {/* Add Project Button */}
          <Button onClick={onAdd} disabled={isSaving} className="h-10 px-6 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>
      </div>

      {/* Technology Pills */}
      <div 
      style={{
          scrollbarWidth: "thin",
          scrollBehavior: "smooth",
        }}
      className="flex gap-2 overflow-x-auto py-2 px-1 rounded-md mb-11">
        <Button
          variant={filterTech === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterTech("all")}
          className="flex-shrink-0"
        >
          All Technologies
        </Button>
        {technologies.map((tech) => (
          <Button
            key={tech.id}
            variant={filterTech === tech.name ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTech(tech.name)}
            className="flex-shrink-0"
          >
            {tech.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProjectControls;
