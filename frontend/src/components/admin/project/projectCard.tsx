import React, { useState, useRef, useEffect } from "react";
import { Eye, Edit, Trash2, MoreVertical, Check, X } from "lucide-react";
import { createPortal } from "react-dom";
import { ProjectResponse } from "@/types/project";

type ProjectCardProps = {
  project: ProjectResponse;
  onEdit: () => void;
  onPreview: () => void;
  onDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
  onToggleFlag: (projectId: number, flag: "live" | "published" | "featured") => void;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onPreview,
  onDelete,
  isSaving,
  isDeleting,
  onToggleFlag,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const toggleMenu = () => {
    if (menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + window.scrollY, left: rect.right + window.scrollX - 176 }); // 176 = width of dropdown
    }
    setMenuOpen((open) => !open);
  };

  const handleToggle = (flag: "live" | "published" | "featured") => {
    onToggleFlag(project.id, flag);
    setMenuOpen(false);
  };

  // Outside click close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // If click is inside the menu button or inside the portal menu, ignore
      if (menuButtonRef.current && menuButtonRef.current.contains(target)) return;
      if (menuRef.current && menuRef.current.contains(target)) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      {project.images && project.images.length > 0 ? (
        <img src={project.images[0].url} alt={project.title} className="w-full h-44 object-cover" />
      ) : (
        <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
          <span
            className={`px-3 py-0.5 rounded-full text-xs font-medium ${
              project.live ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
            }`}
          >
            {project.live ? "Live" : "Offline"}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
  {project.technologies.slice(0, 6).map((tech, idx) => (
    <span
      key={idx}
      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
    >
      {typeof tech === "string" ? tech : `Tech #${tech}`}
    </span>
  ))}

  {project.technologies.length > 4 && (
    <span
      className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-medium cursor-pointer"
      title={project.technologies.slice(4).join(", ")} // hover pe full list bhi dikh jayegi
    >
      +{project.technologies.length - 4} more
    </span>
  )}
</div>


        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-gray-400 capitalize">{project.type}</span>

          <div className="flex gap-2 items-center">
            {/* 3-dot menu button */}
            <button
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
              title="More Actions"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <MoreVertical size={18} />
            </button>

            {/* Dropdown menu (Portal) */}
            {menuOpen &&
              createPortal(
                <div
                  ref={menuRef}
                  style={{ top: menuPos.top, left: menuPos.left }}
                  className="absolute bg-white border rounded-lg shadow-lg z-50 text-sm w-44 py-2 animate-fade-in"
                >
                  <button
                    onClick={() => handleToggle("live")}
                    className="w-full px-4 py-2 hover:bg-gray-50 flex justify-between text-gray-700"
                  >
                    Live {project.live ? <Check size={14} /> : <X size={14} />}
                  </button>
                  <button
                    onClick={() => handleToggle("published")}
                    className="w-full px-4 py-2 hover:bg-gray-50 flex justify-between text-gray-700"
                  >
                    Published {project.published ? <Check size={14} /> : <X size={14} />}
                  </button>
                  <button
                    onClick={() => handleToggle("featured")}
                    className="w-full px-4 py-2 hover:bg-gray-50 flex justify-between text-gray-700"
                  >
                    Featured {project.featured ? <Check size={14} /> : <X size={14} />}
                  </button>
                </div>,
                document.body
              )}

            {/* Edit/Preview/Delete buttons */}
            <button
              onClick={onPreview}
              disabled={isSaving || isDeleting}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
              title="Preview"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={onEdit}
              disabled={isSaving || isDeleting}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors text-yellow-600"
              title="Edit"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={onDelete}
              disabled={isSaving || isDeleting}
              className={`p-1 rounded-full hover:bg-red-100 transition-colors text-red-600 ${
                isDeleting ? "opacity-50 pointer-events-none" : ""
              }`}
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
