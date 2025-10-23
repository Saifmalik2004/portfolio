import React from "react";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { Certificate } from "../../../types/certificate";

interface CertificateCardProps {
  certificate: Certificate;
  onEdit: (certificate: Certificate) => void;
  onDelete: (id: number) => void;
  isSaving: boolean;
  isDeleting: number | null;
}

const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onEdit,
  onDelete,
  isSaving,
  isDeleting,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition-all overflow-hidden">
      {/* Image top full width */}
      <div className="w-full h-40 bg-gray-100">
        <img
          src={certificate.mediaUrl}
          alt={certificate.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title + Org + Date */}
        <h3 className="font-semibold text-gray-900 text-lg mb-1">
          {certificate.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {certificate.issuedOrganisation} •{" "}
          {new Date(certificate.issueDate).toLocaleDateString()}
        </p>

        {/* Credential link */}
        <a
          href={certificate.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:underline text-sm mb-4"
        >
          <ExternalLink size={16} className="mr-1" /> View Credential
        </a>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(certificate)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
            disabled={isSaving || isDeleting === certificate.id}
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(certificate.id!)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            disabled={isSaving || isDeleting === certificate.id}
          >
            {isDeleting === certificate.id ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
