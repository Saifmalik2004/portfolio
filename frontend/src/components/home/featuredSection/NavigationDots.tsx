"use client"

import type React from "react"
import type { ProjectResponse } from "../../../types/project"

export const NavigationDots: React.FC<{
  activeIndex: number
  projectRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  publishedProjects: ProjectResponse[]
}> = ({ activeIndex, projectRefs, publishedProjects }) => (
  <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
    <div className="flex flex-col space-y-3">
      {publishedProjects.map((_, index) => (
        <button
          key={index}
          onClick={() => {
            const element = projectRefs.current[index]
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" })
            }
          }}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index === activeIndex ? "bg-cyan-400 scale-125" : "bg-gray-600 hover:bg-gray-500"
          }`}
        />
      ))}
    </div>
  </div>
)