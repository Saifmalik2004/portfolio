import React from "react"
import { Search, Filter, Plus, RefreshCw } from "lucide-react"
import { Skill } from "../../../types/skill"
import SkillCard from "./SkillCard"
import SkeletonSkillCard from "./SkillSkeleton"

interface SkillListProps {
  skills: Skill[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  filterCategory: string
  setFilterCategory: (value: string) => void
  categories: string[]
  isFetching: boolean
  error: string | null
  isSaving: boolean
  isDeleting: number | null
  onEdit: (skill: Skill) => void
  onDelete: (id: number) => void
  onRefresh: () => void
  onAdd: () => void
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
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || skill.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Skill Management</h2>
          <p className="text-gray-600">Create, edit, and manage your skills</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
            disabled={isFetching}
          >
            <RefreshCw size={20} />
            <span>Refresh</span>
          </button>
          <button
            onClick={onAdd}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg"
            disabled={isSaving}
          >
            <Plus size={20} />
            <span>Add New Skill</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              disabled={isFetching}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              disabled={isFetching}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isFetching
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonSkillCard key={i} />)
          : filteredSkills.length === 0
          ? (
            <div className="text-center py-12 col-span-full">
              <Search size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No skills found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )
          : filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onEdit={onEdit}
                onDelete={onDelete}
                isSaving={isSaving}
                isDeleting={isDeleting}
              />
            ))}
      </div>
    </div>
  )
}

export default SkillList
