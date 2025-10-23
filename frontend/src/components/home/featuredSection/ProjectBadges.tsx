"use client"

import { ProjectType } from "@/types/project"
import type React from "react"

const getTypeColor = (type: string) => {
  switch (type) {
    case "client":
      return "bg-green-100 text-green-700 border-green-200"
    case "personal":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "internship":
      return "bg-purple-100 text-purple-700 border-purple-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

export const ProjectBadges: React.FC<{
  type: ProjectType
  isLive: boolean | undefined
}> = ({ type, isLive }) => (
  <div className="absolute top-4 right-4 flex space-x-2">
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getTypeColor(type || "")}`}>
      {type}
    </span>
    <div
      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
        isLive ? "bg-green-100/90 text-green-700 border border-green-200/50" : "bg-gray-100/90 text-gray-600 border border-gray-200/50"
      }`}
    >
      <span>{isLive ? "Live" : "Development"}</span>
    </div>
  </div>
)