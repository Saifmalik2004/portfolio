import React from "react"
import { Edit, Trash2 } from "lucide-react"
import { Skill } from "../../../types/skill"


interface SkillCardProps {
  skill: Skill
  onEdit: (skill: Skill) => void
  onDelete: (id: number) => void
  isSaving: boolean
  isDeleting: number | null
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onEdit, onDelete, isSaving, isDeleting }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all">
      <div className="px-6 pb-2 pt-4">
        <div className="flex items-center space-x-4">
          <img src={skill.iconUrl} alt={skill.name} className="w-12 h-12 object-contain" />
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{skill.name}</h3>
            <p className="text-gray-600 text-sm">
              {skill.category} | Priority: {skill.priority}
            </p>
          </div>
        </div>
        <div className="mt-2 flex justify-end space-x-2">
          <button
            onClick={() => onEdit(skill)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
            disabled={isSaving || isDeleting === skill.id}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(skill.id!)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            disabled={isSaving || isDeleting === skill.id}
          >
            {isDeleting === skill.id ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SkillCard
