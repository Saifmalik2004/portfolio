import React, { useState } from "react";
import { X } from "lucide-react";
import { Certificate } from "../../../types/certificate";

interface CertificateModalProps {
  certificate: Certificate | null;
  onSave: (data: Certificate) => void;
  onClose: () => void;
  isSaving: boolean;
  error?: string | null;
}

const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onSave,
  onClose,
  isSaving,
  error,
}) => {
  const [formData, setFormData] = useState<Certificate>(
    certificate || {
      title: "",
      issuedOrganisation: "",
      issueDate: "",
      mediaUrl: "",
      credentialId: "",
      credentialUrl: "",
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof Certificate, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Certificate, string>> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.issuedOrganisation.trim())
      newErrors.issuedOrganisation = "Organisation is required";
    if (!formData.issueDate) newErrors.issueDate = "Issue date is required";
    if (!formData.mediaUrl.trim()) newErrors.mediaUrl = "Media URL is required";
    if (!formData.credentialId.trim()) newErrors.credentialId = "Credential ID is required";
    if (!formData.credentialUrl.trim()) newErrors.credentialUrl = "Credential URL is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {certificate ? "Edit Certificate" : "Add New Certificate"}
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
          {/* Fields */}
          {["title", "issuedOrganisation", "issueDate", "mediaUrl", "credentialId", "credentialUrl"].map(
            (field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field.replace(/([A-Z])/g, " $1")} *
                </label>
                <input
                  type={field === "issueDate" ? "date" : "text"}
                  value={(formData as any)[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors[field as keyof Certificate] ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSaving}
                />
                {errors[field as keyof Certificate] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field as keyof Certificate]}</p>
                )}
              </div>
            )
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : certificate ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateModal;
