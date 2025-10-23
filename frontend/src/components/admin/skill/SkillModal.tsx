import React, { useState } from "react"
import { X } from "lucide-react"
import { Skill } from "../../../types/skill"

interface SkillModalProps {
  skill: Skill | null
  onSave: (data: Skill) => void
  onClose: () => void
  isSaving: boolean
  error?: string | null
}

const categories = ["frontend", "backend", "tool"]

const SkillModal: React.FC<SkillModalProps> = ({ skill, onSave, onClose, isSaving, error }) => {
  const [formData, setFormData] = useState<Skill>(
    skill || { name: "", category: "frontend", priority: 1, iconUrl: "" }
  )

  const [errors, setErrors] = useState<Partial<Record<keyof Skill, string>>>({})

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Skill, string>> = {}
    if (!formData.name.trim()) newErrors.name = "Skill name is required"
    if (!formData.category.trim()) newErrors.category = "Category is required"
    if (!formData.iconUrl.trim()) newErrors.iconUrl = "Icon URL is required"
    if (!formData.priority || formData.priority < 1 || formData.priority > 3)
      newErrors.priority = "Priority must be between 1 and 3"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {skill ? "Edit Skill" : "Add New Skill"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            disabled={isSaving}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Skill Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., React"
              disabled={isSaving}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isSaving}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
            <input
              type="number"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.priority ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="1-3"
              min="1"
              max="3"
              disabled={isSaving}
            />
            {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
          </div>

          {/* Icon URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL *</label>
            <input
              type="url"
              value={formData.iconUrl}
              onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.iconUrl ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://example.com/icon.png"
              disabled={isSaving}
            />
            {errors.iconUrl && <p className="text-red-500 text-sm mt-1">{errors.iconUrl}</p>}
            {formData.iconUrl && (
              <img
                src={formData.iconUrl}
                alt="Icon"
                className="mt-2 w-12 h-12 object-contain"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors relative"
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                skill ? "Update" : "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SkillModal
