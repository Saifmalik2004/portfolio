import React from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface TechSectionProps {
  technologies: string[]
}

export const TechnologiesSection: React.FC<TechSectionProps> = ({ technologies }) => {
  const maxVisible = 4
  const visibleTech = technologies.slice(0, maxVisible)
  const extraTech = technologies.slice(maxVisible)
  const remainingCount = extraTech.length

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Technologies Used</h3>
      <div className="flex flex-wrap gap-2">
        {visibleTech.map((tech, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200/70 rounded-xl border border-gray-400/50 text-sm font-medium text-black"
          >
            {tech}
          </div>
        ))}

        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger className="px-3 py-2 bg-gray-200/70 rounded-xl border border-gray-400/50 text-sm font-medium text-black cursor-pointer hover:bg-gray-300/70 transition">
              +{remainingCount} More
            </TooltipTrigger>
            <TooltipContent className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-lg rounded-xl p-3 max-w-xs">
              <div className="flex flex-wrap gap-2">
                {extraTech.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 rounded-lg text-xs border border-gray-300 text-black"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
