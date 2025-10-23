import { useState, useEffect, useRef } from "react";

import { Skill } from "../../types/skill";
import SkillList from "../../components/admin/skill/SkillList";
import SkillModal from "../../components/admin/skill/SkillModal";
import { ConfirmModal } from "../../components/ConfirmModal"; // Import ConfirmModal
import skillService from "@/services/skillService";

type ViewMode = "list" | "add" | "edit";

const SkillManagement = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // New state for modal
  const [skillToDelete, setSkillToDelete] = useState<number | null>(null); // Track skill to delete
  const hasFetched = useRef(false);

  const categories = ["all", "frontend", "backend", "tool"];

  const fetchSkills = async () => {
    setIsFetching(true);
    try {
      const data = await skillService.getAllSkills();
      setSkills(data);
      setError(null);
      hasFetched.current = true;
    } catch (err) {
      setError("Failed to fetch skills. Please try again.");
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current && skills.length === 0) {
      fetchSkills();
    }
  }, []);

  const handleAddSkill = () => {
    setSelectedSkill(null);
    setViewMode("add");
  };

  const handleEditSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setViewMode("edit");
  };

  const handleDeleteSkill = (skillId: number) => {
    setSkillToDelete(skillId); // Set the skill to delete
    setShowConfirmModal(true); // Show the modal
  };

  const confirmDelete = async () => {
    if (skillToDelete === null) return;
    setIsDeleting(skillToDelete);
    try {
      await skillService.deleteSkill(skillToDelete);
      setSkills((prev) => prev.filter((skill) => skill.id !== skillToDelete));
      setError(null);
    } catch (err) {
      setError("Failed to delete skill. Please try again.");
      console.error(err);
    } finally {
      setIsDeleting(null);
      setShowConfirmModal(false); // Close the modal
      setSkillToDelete(null); // Reset skill to delete
    }
  };

  const handleSaveSkill = async (skillData: Skill) => {
    setIsSaving(true);
    try {
      if (selectedSkill?.id) {
        const response = await skillService.updateSkill(selectedSkill.id, skillData);
        setSkills((prev) =>
          prev.map((skill) => (skill.id === selectedSkill.id ? response : skill))
        );
      } else {
        const response = await skillService.createSkill(skillData);
        setSkills((prev) => [response, ...prev]);
      }
      setViewMode("list");
      setSelectedSkill(null);
      setError(null);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to save skill. Please check for duplicates or invalid data."
      );
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setViewMode("list");
    setSelectedSkill(null);
    setError(null);
  };

  const handleRefresh = () => {
    hasFetched.current = false;
    setSkills([]);
    fetchSkills();
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      {viewMode === "list" && (
        <SkillList
          skills={skills}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categories={categories}
          isFetching={isFetching}
          error={error}
          isSaving={isSaving}
          isDeleting={isDeleting}
          onEdit={handleEditSkill}
          onDelete={handleDeleteSkill} // Pass updated handler
          onRefresh={handleRefresh}
          onAdd={handleAddSkill}
        />
      )}
      {(viewMode === "add" || viewMode === "edit") && (
        <SkillModal
          skill={selectedSkill}
          onSave={handleSaveSkill}
          onClose={handleCloseModal}
          isSaving={isSaving}
          error={error}
        />
      )}
      <ConfirmModal
        title="Delete Skill"
        description="Are you sure you want to delete this skill? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        trigger={null} // No trigger; controlled by state
        open={showConfirmModal} // Control modal visibility
        onOpenChange={setShowConfirmModal} // Update state when modal opens/closes
      />
    </div>
  );
};

export default SkillManagement;